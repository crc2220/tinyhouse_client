import { useState, useEffect, useReducer, useCallback } from "react";
import { server } from "./server";
// to define the shape of the State
// this state will have a data property but what will that shape be it could vary depending on the graphql query
// so we make that data interface/type a generic which is passed down when calling this custom hook
// use union type to include null for before api is called
interface State<TData> {
    data: TData | null; 
    loading: boolean;
    error: boolean;
}

type Action<TData> = 
  { type: "FETCH" } 
| { type: "FETCH_SUCCESS", payload: TData} 
| { type: "FETCH_ERROR"};

const reducer = <TData>() => (state: State<TData>, action: Action<TData>): State<TData> => {
    switch (action.type) {
        case "FETCH":
            return {...state, loading: true}
        case "FETCH_SUCCESS":
            return {data: action.payload, loading: false, error: false}
        case "FETCH_ERROR":
            return {...state, loading: false, error: true}
        default:
            throw new Error();
        
    }
}

// specifying the return Type of useQuery - return { ...state, refetch: fetch };
// we return state so we extend return Type with State interface
// we return refetch and include it in the return Type -- a function that returns nothing
// the refetch/fetch function triggers the state to update -- useQuery returns that state as a separate variable
// you can extend interfaces but cannot extend types in Typescript
interface QueryResult<TData> extends State<TData>{
    refetch: () => void;
}

// pass in the type via a generic, say what the shape of the data being returned should be
export const useQuery = <TData = any>(query: string): QueryResult<TData> => {

    // help pass TData into reducer of useReducer
    const fetchReducer = reducer<TData>();

    const [state, dispatch] = useReducer(fetchReducer, { 
        data: null,
        loading: false,
        error: false
    });

    // const [state, setState] = useState<State<TData>>({
    //     data: null,
    //     loading: false,
    //     error: false
    // });

    const fetch = useCallback(() => {
        // if the query changes then it will re-initialize this function call this function again
        // if the query is the same then don't re-initialize it and instead use cached function
        
        const fetchApi = async () => {
            // before we had setState for each action: loading, data, error
            // we can use useReducer to compose/abstract these out
            try {
                // set loading
                // setState({data: null, loading: true, error: false});
                dispatch({type: "FETCH"})
                const { data, errors } = await server.fetch<TData>({ query });
                if(errors && errors.length){
                    throw new Error(errors[0].message);
                }
                // set data
                // setState({ data, loading: false, error: false });
                dispatch({type: "FETCH_SUCCESS", payload: data })
            } catch (err) {
                // set error
                // setState({ data: null, loading: false, error: true });
                dispatch({type: "FETCH_ERROR"})
                throw console.error(err);
            }
            
        }
        fetchApi();
    }, [query]);

   
    useEffect(() => {
        // will run when the component is rendered the first time
        // fetch dep is a callback that is cached and is unlikely to change
        // because it's dependency, query, is unlikely to change  
        fetch();
    }, [fetch]);

    return { ...state, refetch: fetch };
};