const formSubmissionHandler = (event) => {
    event.preventDefault();
  
    const formElement = event.target,
      { action, method } = formElement,
      body = new FormData(formElement);
  
    fetch(action, {
      method,
      body
    })
      .then((response) => response.json())
      .catch((error) => {
        // Handle the case when there's a problem with the request
      });
  };
  
  const formElement = document.querySelector("form");
  
  formElement.addEventListener("submit", formSubmissionHandler);