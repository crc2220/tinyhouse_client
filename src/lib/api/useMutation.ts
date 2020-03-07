import { useState, useReducer } from "react";
import { server } from "./server";

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

// this tuple is needed because we're returning an array of different types and Typescript needs to know about this
type MutationTuple<TData, TVariables> = [
    (variables?: TVariables | undefined) => Promise<void>,
    State<TData>
]

export const useMutation = <TData = any, TVariables = any>(query: string): MutationTuple<TData, TVariables> => {
    // help pass TData into reducer of useReducer
    // reducer accepts TData generic and returns a reducer function with TData typed for arguments: state, action and return Type
    // this way when we call useReducer we get a Type'd state variable
    const fetchReducer = reducer<TData>();

    const [state, dispatch] = useReducer(fetchReducer, { 
        data: null,
        loading: false,
        error: false
    });

    const fetch = async (variables?: TVariables) => {
        try { 
            // setState({data: null, loading: true, error: false});
            dispatch({type: "FETCH"})
            const { data, errors } = await server.fetch<TData, TVariables>({
                query,
                variables
            });
            if (errors && errors.length) {
                throw new Error(errors[0].message);
            }
            // setState({data, loading: false, error: false});
            dispatch({type: "FETCH_SUCCESS", payload: data})
        } catch (err) { 
            // setState({data: null, loading: false, error: true});
            dispatch({type: "FETCH_ERROR"})
            throw console.error(err);
        }
    }
    // you are returning a function when you call useMutation to be ran later
    // we usually return arrays with the same type, this has multiple types
    // you need to tell TypeScript what each type is for each index - Tuples are good for this
    return [fetch, state];
}