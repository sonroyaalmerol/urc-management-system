import slugify from "slugify"

const slugGenerator = (arg: string) => slugify(arg, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g })

export default slugGenerator