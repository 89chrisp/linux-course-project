#!/usr/bin/env bash

# Reading and defining input and output files
input=salar.csv
# skipping first line and read file to variable inputV
inputV=$( cat $input | awk "NR>1" )
output=salar.json

first_line=$( cat $input | awk "NR==2" )
a=0
headings=$( echo "$first_line" | awk -F, "{print NF}" )
lines=$( cat $input | wc -l )
lines=$((lines-1))
while [ $a -lt "$headings" ]
do
        head_array[$a]=$(echo "$first_line" | awk -v x=$((a + 1)) -F"," '{print $x}')
        a=$((a+1))
done

c=0
echo "{" >> $output
echo '"salar": [' >> $output
while [ $c -lt $lines ]
do
        IFS= read -r each_line
        if [ $c -ne 0 ]; then
                d=0
                echo -n "{" >> $output
                while [ $d -lt "$headings" ]
                do
                        each_element=$(echo "$each_line" | awk -v y=$((d + 1)) -F"," '{print $y}')
                        if [ $d -ne $((headings-1)) ]; then
                            if [[ "$each_element" == "" ]]; then
                                echo -n '"'"${head_array[$d]}"'":null,' >> $output
                            else
                                echo -n '"'"${head_array[$d]}"'":"'"$each_element"'",' >> $output
                            fi

                        else
                            if [[ "$each_element" -eq "" ]]; then
                                echo -n '"'"${head_array[$d]}"'":null' >> $output
                            else
                                echo -n '"'"${head_array[$d]}"'":"'"$each_element"'"' >> $output
                            fi
                        fi
                        d=$((d+1))
                done
                if [ $c -eq $((lines-1)) ]; then
                        echo "}" >> $output
                else
                        echo "}," >> $output
                fi
        fi
        c=$((c+1))
done <<< "$inputV"
echo "]" >> $output
echo "}" >> $output
