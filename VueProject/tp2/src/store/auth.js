/**Auth is responsible to hold the logic behind keeping the information
 * about the logged in user when the pages change
 */
import axios from 'axios'

export default {
    namespaced: true,
    //Variables to keep data persisting while changes pages
    state: {
        user: null,
        error: null,
    },
    //Return state variables data
    getters: {
        //Check if user is authenticated
        isAuthenticated (state){
            return state.user ? true : false
        },
        //Returns user data
        userData (state){
            return state.user
        },
        //Return error
        hasError (state){
            return state.error
        }
        
    },
    //Perform changes on state variable data
    mutations: {
        //Mutation to change user value
        'SET_USER'(state, user){
            state.user = user
        },
        //Mutation to change error value
        'SET_ERROR'(state, error){
            state.error = error
        }
    },
    //Coordinates dispatch and commits actions in order to perform mutations
    actions: {
        //Dispatch action -> sends api returned response (user data) to commit actions
        login({ dispatch }, credentials) {
            axios
                .get(`http://localhost:3000/api/tp2/user/login/${credentials.username},${credentials.password}`)
                .then(response => response)
                .then(data => {
                    if(typeof (data.data) === 'string'){
                        dispatch('authenticationError', data.data)
                    }else{
                        dispatch('authenticate', data.data) 
                    }     
                })
                .catch(error => console.log(error))
        },

        //Dispatch Action -> user data null
        logout({ dispatch }){
            dispatch('authenticate', null)
        },

        /**Commit action -> if API response sucessful.
         * If login in -> commits user data (erases possible existing error)
         * If login out -> user data becomes null (erases possible existing error)
        */
        authenticate({ commit }, user){
            commit('SET_USER', user)
            commit('SET_ERROR', null)
        },

        /**Commit action -> if API response unsucessful. 
         * commits error
        */
        authenticationError({ commit }, error){
            commit('SET_ERROR', error)
        },

        /**Commit action -> maintains user data when refreshing page */
        reauthentication({ commit }, userData){
            commit('SET_USER', JSON.parse(userData))
        },

    },
}
