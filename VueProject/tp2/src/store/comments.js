/**ShoppingCart is responsible to hold the logic behind keeping data about 
 * the logged in user items that were previously incorporated on the shopping cart
 */
import axios from 'axios'

export default {
    namespaced: true,
    //Variables to keep data persisting while changes pages
    state: {
        comments: null,
    },
    //Return state variables data
    getters: {
        //Returns all data on the user's shopping cart
        getComments (state){
            return state.comments
        },
    },
    //Perform changes on state variable data
    mutations: {
        //Mutation to change shopping cart value
        'SET_COMMENTS'(state, commentsall){
            state.comments = commentsall
        }
    },
    //Coordinates dispatch and commits actions in order to perform mutation
    actions:{
        //Dispatch action -> sends api returned response (shopping cart data) to commit action
        fetchComments({ dispatch }, idShow){
            axios
                .get(`http://localhost:3000/api/tp2/shows/comments/${idShow}`)
                .then(response => response)
                .then(data => {
                    console.log(data)
                    dispatch('insertComments', data.data); 
                })
                .catch(error => console.log(error))
        },

        //Commit action -> commits shopping cart data
        insertComments( { commit }, commentsall ){
            commit('SET_COMMENTS', commentsall)
        }
    },
}