#!/bin/bash

# Set the input and output file names
input_file="input.txt"
output_file="output.yaml"

# Open the output file and write the initial "routes:" line
echo "routes:" > $output_file

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

        # Write the redirect rule to the output file
        echo "  - type: redirect" >> $output_file
        echo "    source: /$substring" >> $output_file
        echo "    destination: /$line" >> $output_file
    done
done < $input_file