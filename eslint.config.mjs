import globals from "globals"
import pluginJs from "@eslint/js"


export default [
  {
    languageOptions: { 
      globals: globals.browser
    
    },
    ignores:[]
  },
  pluginJs.configs.recommended,
  {
    rules:{
     "no-unused-vars":0,
     'no-empty':0,
     



    }
  }
]
