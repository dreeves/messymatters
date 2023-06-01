#!/bin/bash

# Set the input and output file names
input_file="input.txt"
output_file="output.yaml"

# Delete the output file if it already exists
if [ -f "$output_file" ]; then
    rm $output_file
fi

# Open the output file and write the initial "routes:" line
echo "    routes:" > $output_file

# Read each line of the input file
while read line; do
    # Remove any leading or trailing whitespace from the line
    line=$(echo $line | xargs)

    # Get the length of the line
    length=${#line}

    # Loop through all possible substring lengths
    for (( i=1; i<=$length; i++ )); do
        # Get the current substring
        substring=${line:0:$i}

        # Check if the redirect rule is a duplicate
        if grep -q "source: /$substring" $output_file; then
            continue
        fi

        # Check if the source and destination fields are identical
        if [ "$substring" == "$line" ]; then
            continue
        fi

        # Write the redirect rule to the output file
        echo "      - type: redirect" >> $output_file
        echo "        source: /$substring" >> $output_file
        echo "        destination: /$line" >> $output_file
    done
done < $input_file