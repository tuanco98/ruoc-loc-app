/**
 * this is template api
 * @param parent 
 * @param {TemplateInput} args 
 * @param ctx 
 * @return {TemplateOutput}
 */

import { ErrorHandler } from "../../../../lib/error_handler"

const template = (parent: any, args: any, ctx: any) => {
    try {
        //Validate args
        //Get data
        //Return
    } catch (e) {
        ErrorHandler(e, args, template.name)
    }
}