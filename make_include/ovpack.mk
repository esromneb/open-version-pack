
.PHONY: create indent discover-pack discover-pack-submodule discover-pack-git append-submodule append-git append-build no-char-message

ifdef f

create:
	@echo file: ${f}
	@echo "\n"


indent:
	sed -i 's/^/,/' ${f}

# discover and pack, will detect if submodules exist and call the correct target
discover-pack:
	@echo Fixme
	#bash -c 'if [[ $(git submodule foreach echo x | head -c1 | wc -c) -ne 0 ]]; then make f=${f} discover-pack-submodule; else make f=${f} discover-pack-git; fi'


# only run if there are submodules
discover-pack-submodule:
	git submodule foreach bash -c 'git branch -vv | sed -En "s/.*\[([^/]*)\/.*/\1/p" | xargs -I{} bash -c "git remote get-url {}; git describe --match=NeVeRmmAkeaAaTagSlaAhBrancHL1k3thi5 --always --abbrev=40 --dirty"' | grep -v 'Entering ' | sed -E 'N;s/(.*)\n(.*)/a=\1 b=\2/' | xargs -n 2 make f=${f} append-submodule
	make f=${f} indent
	make f=${f} discover-pack-git

# only run if there are no submodules
discover-pack-git:
	git branch -vv | sed -En "s/.*\[([^/]*)\/.*/\1/p" | xargs -I{} bash -c "git remote get-url {}; git describe --match=NeVeRmmAkeaAaTagSlaAhBrancHL1k3thi5 --always --abbrev=40 --dirty" | sed -E 'N;s/(.*)\n(.*)/a=\1 b=\2/' | xargs -n 2 make f=${f} append-git


ifdef a

# using https://stackoverflow.com/questions/40477948/prepend-a-text-to-a-file-in-makefile to append
# to head of line
# however it doesnt work if the file is empty
# so all of these are copied

append-submodule:
	test -f ${f} && sed -i "1i submodule, ${a}, ${b}" ${f} || echo submodule, ${a}, ${b} > ${f}
# 	sed -i "" '1{h;s/.*/${a}/;G;}' input
append-git:
	test -f ${f} && sed -i "1i git, ${a}, ${b}" ${f} || echo git, ${a}, ${b} > ${f}

append-build:
	test -f ${f} && sed -i "1i ${a}, ${b}, ${c}" ${f} || echo "It is illegal to append a build to an empty file"
	# @echo git, ${a}, ${b} >> ${f}

# echo "$(echo -n 'git, ${a}, ${b}'; cat ${f})" > new.txt
#@echo git, ${a}, ${b} >> ${f}





else

endif

else
no-char-message:
	@echo please add f=xxx

create: no-char-message
indent: no-char-message

endif


