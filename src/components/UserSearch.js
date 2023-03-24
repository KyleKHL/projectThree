// UserSearch.js
import { useState, useEffect } from "react";
import Form from "./Form.js";
import RecipeGallery from "./RecipeGallery.js";
// import firebase:
import firebaseInfo from "../firebase.js";



const UserSearch = () => {

    // 1a) initialize state for recipe data returned from API
    const [ recipe, setRecipe ] = useState([]);

    // 1b) initialize state for API request error
    const [ apiError, setApiError ] = useState(false);

    // create default values to ALL inputfields 
    const initialValues = {
        inputOne: '',
        inputTwo: '',
        inputThree: '',
        selectMealType: '',
        cuisineType: '',
    }
    // 1c) initialize state for userInput for ingredient inputs
    const [values, setValues] = useState(initialValues)

    // 3. define submit event handler - to be passed down into Form.js
    const handleSubmit = (event) => {
        event.preventDefault();
        // call function to fetch data from API
        fetchRecipeData()
    }
    // 4. handleChange function to allow react to control input state
    const handleChange = (event) => {
        // if(event.target.value === ''){
        //     setIngredInputOne('');
        // }

        const { name, value } = event.target;

        setValues({
            ...values,
            [name]: value,
        });

        // setIngredInputOne(event.target.value.trim());
    };
console.log(values)
    // 2. fetch data from API
    const fetchRecipeData = () => {
        // construct URL
        const appId = 'fc3a2a4e';
        const apiKey = '5fabaeb42a0ec8a788b0ba21d8c502ef';
        const url = new URL('https://api.edamam.com/api/recipes/v2');
        url.search = new URLSearchParams({
            app_id: appId,
            app_key: apiKey,
            type: 'public',
            q: `${values.inputOne} ${values.inputTwo} ${values.inputThree}`,
            mealType: values.selectMealType,
            cuisineType: values.cuisineType,
            random: true,
        })

        // fetch recipe data
        fetch(url)
            .then((res) => {

                if (res.ok){
                    return res.json();
                }else{
                    throw new Error(res);
                }
            })
            .then((apiData) => {
                console.log(apiData.hits)
                const apiArray = apiData.hits;
                apiArray.splice(10, 10)
                // update recipe state:
                setRecipe(apiArray)
                // update apiError as false
                setApiError(false)
            })
            .catch((error) => {
                // update apiError as true
                setApiError(true)
                // update the recipe state to empty array
                setRecipe([])
            })

    }

    return(
        <>
        {/* pass down error state to form */}
        {/* pass down handleSubmit callback function to form */}
            <Form 
                errorState = {apiError}
                handleSubmit = {handleSubmit}
                handleChange = {handleChange}
                inputValue = {values}
            />
            <RecipeGallery recipeArray = {recipe} />
        </>
    )
}

export default UserSearch;