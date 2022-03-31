# Simple rest api via Express framework

This is my basic starter setup for a rest api. Mongodb is the main dependency for persistence data.
Joi for validation and esbuild for bundle the TypeScript.

I've followed the [clean architecture](https://www.tooploox.com/blog/yet-another-clean-architecture)
principles from Uncle Bob. For this architecture `short-url` is the entity.

## Id generator logic

I made a little bit of complex logic to reduce the redundancy by adding a timestamp to the equation.
If the timestamp is the same as the previous execution I iterate over the last random indexes and
add + 1 to the previous value to get a different random number. This is kind of a counter to prevent
the next id. the file is in [src/utils/generateRandomId.ts](src/utils/generateRandomId.ts)
