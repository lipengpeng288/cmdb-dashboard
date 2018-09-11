#!/bin/bash

BANNER='/** This file is auto-generated from material.project.json. DO NOT edit it manually!
 * 
 * EChart 4 Theme Stylesheet Bundle.
 * 
 * Online Editor: http://echarts.baidu.com/theme-builder/
 */'
EXPORTED_VAR='ChartTheme'
SOURCE='./material.project.json'
TARGET='./chart-theme.ts'


banner=${BANNER}'

''export const '${EXPORTED_VAR}' = '
echo -n "$banner" > ${TARGET}
cat ${SOURCE} >> ${TARGET}