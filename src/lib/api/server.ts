// we're adding variables as an optional field
// since we're introducting mutations 
// TVariables could be any shape so we're making it a generic <>
// when we send Body we'll pass in the specific variable interface into it
interface Body<TVariables> {
    query: string;
    variables?: TVariables;
}
// when you call server.fetch from another component
// it could be a mutation 
// what will the shape of the mutation be?
// how does that object get passed through?
// how can we pass through the Type/Interface for that shape?

export const server = {
    fetch: async <TData = any, TVariables = any>(body: Body<TVariables>) => {
        // make sure you don't do cross-origin resource sharing
        // POST to graphql
        const res = await fetch("/api", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        // below is an example of Type Assertion
        // tells Typescript you know what you're doing
        // override Typescripts infers or analyzes by doing {this} as {Type}
        // when you Type out a Promise you say Promise and then the thing Type it returns
        // you do Type assertion when you know better than the compiler  
        return res.json() as Promise<{ data: TData}>;

    }
}