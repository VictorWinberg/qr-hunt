#!/bin/bash
#
# Script: migrations/run.sh
# Description: Automated schema migration for PostgreSQL
# Usage: ./migrations/run.sh DATABASE
#
# Details:
# 	Just store the .sql migrations scripts in a folder, file
# 	names must be incremental numbers (1.sql, 2.sql, ...).
# 	The script stores current version in a ".version" file
# 	and logs PostgreSQL output to a ".migrations.log" file,
# 	both stored in the same folder as the scripts.
#

cd $(dirname "${BASH_SOURCE[0]}")

VERSION_FILE='.version'
CURRENT_VERSION="`cat $VERSION_FILE 2>/dev/null || echo 0`"
USAGE="Usage: $0 DATABASE [--check] [--fix]"
LOG_FILE_PATH=".migrations.log"
TMP_ERR_FILE_PATH=".tmp.err"

echo -e "logs for last migration run -- \"$(date)\"\n" > $LOG_FILE_PATH

# Check if psql is installed
which psql &>/dev/null
if [ $? -ne 0 ]; then
	echo "WARN: psql is not installed, aborting migrations"
	exit 0
fi

# Check if arguments exist
if [ $# -eq 0 ]; then
	echo $USAGE
	exit 1
fi
DATABASE="$1"
shift

while [[ $# -gt 0 ]]; do
case "$1" in
    --check)
    CHECK=YES
    shift
    ;;
    --fix)
    FIX=YES
    shift
    ;;
	*)
	echo $USAGE
	exit 1
    ;;
esac; done;

for FNAME in `ls *.sql | sort -n`; do
	SCRIPT_VERSION="${FNAME:: 8}"
	if [ "$SCRIPT_VERSION" -gt "$CURRENT_VERSION" ]; then
		SCRIPT_PATH="$FNAME"

		if [[ -n $CHECK ]]; then
			BLACK=$'\e[40;97m'
			YELLOW=$'\e[103;30m'
			GREEN=$'\e[92;40m'
			NC=$'\e[0m'
			echo "███    ███ ██  ██████  ██████   █████  ████████ ███████ ██ "
			echo "████  ████ ██ ██       ██   ██ ██   ██    ██    ██      ██ "
			echo "██ ████ ██ ██ ██   ███ ██████  ███████    ██    █████   ██ "
			echo "██  ██  ██ ██ ██    ██ ██   ██ ██   ██    ██    ██         "
			echo "██      ██ ██  ██████  ██   ██ ██   ██    ██    ███████ ██ "
			echo ""
			echo "${BLACK}db${NC} ${YELLOW}WARN${NC} Please run migrations with ${GREEN}npm run db:migrate${NC}"
			echo ""
			exit 0
		fi

		if [[ ! -n $FIX ]]; then
			read -p "Do you want to run migration \"$SCRIPT_PATH\"? (y/N) " -n 1 -r MIGRATE; echo;
			if [[ ! $MIGRATE =~ ^[Yy]$ ]]; then exit 0; fi
		fi

		# Load the .sql file
		echo -n "$SCRIPT_PATH ... "
		PSQL=$(psql -1 -v ON_ERROR_STOP=1 -a -d $DATABASE -f $SCRIPT_PATH 2>$TMP_ERR_FILE_PATH)
		RET_CODE=$?
		echo -e "$SCRIPT_PATH\n$PSQL" >> $LOG_FILE_PATH

		# Handle potential PostgreSQL errors
		if [ $RET_CODE -ne 0 ]; then
			echo "ERR $RET_CODE"
			cat $TMP_ERR_FILE_PATH

			echo "- ERR $RET_CODE" >> $LOG_FILE_PATH
			cat $TMP_ERR_FILE_PATH >> $LOG_FILE_PATH
		else
			echo "OK"
			echo "- OK" >> $LOG_FILE_PATH
		fi

		echo "" >> $LOG_FILE_PATH

		# Update current migration version
		echo $SCRIPT_VERSION > $VERSION_FILE
	fi
done

rm -f $TMP_ERR_FILE_PATH
