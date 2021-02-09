/**Responsible to perform operations each time a mutation occurs */
import store from '@/store'

/**Store.subscribe listens to eventual mutations that may occur during runtime 
 * Every time a mutation occurs this method is going to be executed and is going
 * to evaluate which type of mutation occured (which mutation method was used)
 * Depending on the type different actions are performed
*/
store.subscribe((mutation) => {
    switch(mutation.type){
        /**If mutations is on setting user data in store state variable -> saves user into localstorage
         * If there is no payload the localstorage item is removed
        */
        case 'auth/SET_USER':
            if(mutation.payload){
                localStorage.setItem('user', JSON.stringify(mutation.payload))
            }else{
                localStorage.removeItem('user')
            }
    }
})