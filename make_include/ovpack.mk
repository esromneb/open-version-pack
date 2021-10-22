
ifdef f

create:
	@echo file: ${f}

indent:
	sed -i 's/^/,/' ${f}

ifdef a

# append-git:
# 	@echo ${h} ${}

append-submodule:
	touch ${f}
	@echo submodule, ${a}, ${b} >> ${f}
append-git:
	touch ${f}
	sed -i "1i git, ${a}, ${b}" ${f}
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


