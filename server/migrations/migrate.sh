#!/bin/bash
#
# Script: migrate.sh
# Description: Automated schema migration for PostgreSQL
# Usage: ./migrate.sh DATABASE
#
# Details:
# 	Just store the .sql migrations scripts in a folder, file
# 	names must be incremental numbers (1.sql, 2.sql, ...).
# 	The script stores current version in a ".version" file
# 	and logs PostgreSQL output to a ".migrations.log" file,
# 	both stored in the same folder as the scripts.
#

VERSION_FILE='.version'
CURRENT_VERSION="`cat $VERSION_FILE 2>/dev/null || echo 0`"
USAGE="Usage: $0 DATABASE"
LOG_FILE_PATH=".migrations.log"

echo -e "Logs for ./migrate.sh -- \"$(date)\"\n" > $LOG_FILE_PATH

# Check if psql is installed
which psql
if [ $? -ne 0 ]; then
	echo "WARN: psql is not installed, aborting migrations"
	exit 0
fi

# Get database argument
if [ $# -ne 1 ]; then
	echo $USAGE
	exit 1
fi
DATABASE="$1"

for FNAME in `ls *.sql | sort -n`; do
	if [ "$FNAME" = `basename $0` ]; then
		continue
	fi
	SCRIPT_VERSION="${FNAME:: 8}"
	if [ "$SCRIPT_VERSION" -gt "$CURRENT_VERSION" ]; then
		SCRIPT_PATH="$FNAME"

		# Load the .sql file
		echo "Applying $SCRIPT_PATH..."
		PSQL=$(psql -1 -v ON_ERROR_STOP=1 -a -d $DATABASE -f $SCRIPT_PATH 2>&1)
		RET_CODE=$?
		echo -e "$SCRIPT_PATH\n$PSQL" >> $LOG_FILE_PATH
		
		# Handle potential PostgreSQL errors
		if [ $RET_CODE -ne 0 ]; then
			echo "An error occured, check $LOG_FILE_PATH for more details."
			echo "- ERR $RET_CODE" >> $LOG_FILE_PATH
		else
			echo "- OK" >> $LOG_FILE_PATH
		fi

		echo "" >> $LOG_FILE_PATH

		# Update current migration version
		echo $SCRIPT_VERSION > $VERSION_FILE
	fi
done
