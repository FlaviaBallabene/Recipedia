import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import background from "../../img/background.png";

export const RecipeCard = ({ origin }) => {
  console.log("Origin", origin);
  const { store, actions } = useContext(Context);
  // RecipeCard-Chatbot
  const params = useParams();
  const [recipe, setRecipe] = useState();
  const [recipeInfo, setRecipeInfo] = useState();
  const [fecthStatus, setFetchStatus] = useState("pending");

  useEffect(() => {
    if (store.recentlyFetchedRecipes.length != 0) {
      setRecipe(
        store.recentlyFetchedRecipes.find((item) => item.title == params.title)
      );
    } else {
      setFetchStatus("error");
    }
  }, [params]);

  useEffect(() => {
    const getInfo = async () => {
      let parts = recipe.link.split("/");
      let recipeString = parts[parts.length - 1];
      let recipeStringParts = recipeString.split("-");
      let recipeId = recipeStringParts[recipeStringParts.length - 1];
      let resp = await fetch(
        "https://api.spoonacular.com/recipes/" +
          recipeId +
          "/information?apiKey=" +
          process.env.SPOONACULAR_API_KEY
      );

      if (resp.status != 200) {
        setFetchStatus("error");
      } else {
        let info = await resp.json();
        setRecipeInfo(info);
        setFetchStatus("success");
      }
    };
    if (recipe) {
      getInfo();
    }
  }, [recipe]);

  // RecipeCard-Home
  const { title } = useParams();
  const [analyzedInstructions, setAnalyzedInstructions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const randomRecipe = store.homeRecipe.find(
      (recipe) => recipe.title === title
    );
    if (randomRecipe) {
      actions
        .getRecipeDetails(randomRecipe.id)
        .then((data) => {
          if (
            data.analyzedInstructions &&
            data.analyzedInstructions.length > 0
          ) {
            setAnalyzedInstructions(data.analyzedInstructions[0].steps);
          } else {
            setAnalyzedInstructions([]);
          }
          setLoading(false); // Set loading to false once data is fetched
        })
        .catch((error) =>
          console.error("Error fetching recipe details!: ", error)
        );
    }
  }, [title]);

  return (
    <div
      className="jumbotron text-center d-flex mt-5"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        padding: "50px 0 20px 0",
        minHeight: "100vh",
        justifyContent: "space-around",
        fontFamily: "avenir-light",
        color: "#303131",
      }}
    >
      {fecthStatus == "pending" && origin == "chatbot" ? (
        <div className="text-center p-5 h-25">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-3">Fetching recipe information...</p>
        </div>
      ) : fecthStatus == "error" && origin == "chatbot" ? (
        <div className="bg-white text-center p-5 h-25">
          <h2 className="text-danger">Oops! Something went wrong...</h2>
          <p className="text-muted">
            We apologize for the inconvenience. Please try again later.
          </p>
        </div>
      ) : fecthStatus == "success" && origin == "chatbot" ? (
        <div
          className="card"
          style={{
            width: "100rem",
            padding: "50px 30px 50px 30px",
            maxWidth: "800px",
            // alignItems: "center",
            maxHeight: "1500px",
          }}
        >
          <h5
            className="card-title"
            style={{
              margin: "50px 30px 50px 30px",
              fontSize: "30px",
            }}
          >
            {recipe?.title}
          </h5>
          <span>
            <img
              src={recipe?.image}
              style={{ width: "600px", height: "auto", borderRadius: "5px" }}
            />
          </span>

          <div
            className="row"
            style={{
              maxWidth: "90%",
              margin: "40px 0 0 40px",
              fontSize: "16px",
              textAlign: "initial",
              justifyContent: "flex-start",
            }}
          >
            <div className="col-sm-12 mb-3 mb-sm-0">
              <div className="card" style={{ borderColor: "white" }}>
                <div className="card-body">
                  <h5 className="card-title">COOKING MINUTES</h5>
                  <p className="card-text" style={{ fontSize: "20px" }}>
                    {recipeInfo?.readyInMinutes}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-sm-12">
              <div className="card" style={{ borderColor: "white" }}>
                <div className="card-body">
                  <h5 className="card-title" style={{ textAlign: "justify" }}>
                    INGREDIENTS
                  </h5>
                  {recipeInfo?.extendedIngredients?.map((ingredient, index) => {
                    return (
                      <>
                        {ingredient.original}
                        {index == recipeInfo.extendedIngredients.length - 1
                          ? "."
                          : ", "}
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div
            className="row card-body"
            style={{
              maxWidth: "90%",
              margin: "10px 0 0 40px",
              textAlign: "initial",
              justifyContent: "flex-start",
            }}
          >
            <h5 className="card-title">PREPARATION</h5>
            <p
              className="card-text"
              style={{
                width: "600px",
                textAlign: "justify",
                marginTop: "10px",
              }}
            >
              {recipeInfo?.instructions}
            </p>
            {/* <ol className="list-group">
            {recipeInfo?.analyzedInstructions[0].steps.map((item, index)=>{
              return(
                <li className="list-group-item">
                  {item.step}
                </li>
              );
            })}
            </ol> */}
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            background: "white",
            flexDirection: "column",
            border: "1px solid",
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
          }}
        >
          <h2>{title}</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <img src={store.imageURL} alt="recipe" />
            </div>
          )}
          <p>Instructions: {store.instructions} </p>
          <p>Cooking time: {store.cookingTime} minutes</p>
          <p>Ingredients: {store.ingredients}</p>
          <p>Preparation</p>
          <ul>
            {analyzedInstructions.map((step, index) => (
              <li key={index}>{step.step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

//   return (
//     <div
//       className="jumbotron text-center d-flex mt-5"
//       style={{
//         backgroundImage: `url(${background})`,
//         backgroundSize: "cover",
//         backgroundRepeat: "no-repeat",
//         backgroundPosition: "center",
//         padding: "50px 0 20px 0",
//         minHeight: "100vh",
//         justifyContent: "space-around",
//         fontFamily:"avenir-light", color: "#303131"
//       }}
//     >
// 		{/* <button onClick={()=> (console.log(recipeInfo))}>click here</button> */}
//       <div
//         className="card"
//         style={{
//           width: "100rem",
//           padding: "50px 30px 50px 30px",
//           maxWidth: "800px",
//           // alignItems: "center",
//           maxHeight: "1500px"
//         }}
//       >
//         <h5
//           className="card-title"
//           style={{
//             margin: "50px 30px 50px 30px",
//             fontSize: "30px",
//           }}
//         >
//           {recipe?.title}
//         </h5>
//         <span>
//           <img src={recipe?.image} style={{width: "600px", height: "auto", borderRadius: "5px",}}/>
//         </span>

//         <div className="row" style={{ maxWidth: "90%", margin:"40px 0 0 40px", fontSize: "16px", textAlign:"initial", justifyContent: "flex-start"}}>
//           <div className="col-sm-12 mb-3 mb-sm-0">
//             <div className="card" style={{borderColor:"white"}}>
//               <div className="card-body">
//                 <h5 className="card-title">COOKING MINUTES</h5>
//                 <p className="card-text" style={{fontSize:"20px"}}>{recipeInfo?.readyInMinutes}</p>
//               </div>
//             </div>
//           </div>
//           <div className="col-sm-12">
//             <div className="card" style={{borderColor:"white"}}>
//               <div className="card-body">
//                 <h5 className="card-title" style={{textAlign: "justify", }}>INGREDIENTS</h5>
//                 {recipeInfo?.extendedIngredients?.map((ingredient, index)=>{
//                   return (
//                     <>
//                       {ingredient.original}{index==recipeInfo.extendedIngredients.length-1?".":", "}
//                     </>
//                   )
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="row card-body" style={{maxWidth: "90%", margin: "10px 0 0 40px", textAlign:"initial", justifyContent: "flex-start"}}>
//         <h5 className="card-title">PREPARATION</h5>
//           <p
//             className="card-text"
//             style={{width: "600px"}}
//           >
//             {recipeInfo?.instructions}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };