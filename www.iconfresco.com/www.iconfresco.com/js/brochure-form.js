document
    .getElementById("brochure-form")
    .addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phoneNo = document.getElementById("phoneNo").value.trim();
        const message = document.getElementById("message").value.trim();

        // Validation patterns
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;

        // Validate fields
        if (name === "" || email === "" || phoneNo === "" || message === "") {
            Swal.fire({
                title: "Error!",
                text: "All fields are required.",
                icon: "error",
            });
            return;
        }
        if (!emailRegex.test(email)) {
            Swal.fire({
                title: "Error!",
                text: "Please enter a valid email address.",
                icon: "error",
            });
            return;
        }
        if (!phoneRegex.test(phoneNo)) {
            Swal.fire({
                title: "Error!",
                text: "Please enter a valid 10-digit phone number.",
                icon: "error",
            });
            return;
        }
        // Show loading message
        Swal.fire({
            title: 'Submitting...',
            text: 'Please wait while we process your request.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const formData = new FormData(this);

        fetch("submit.php", {
                method: "POST",
                body: formData,
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                if (data.status === "success") {
                    Swal.fire({
                        title: "Form Submitted!",
                        text: "Your form has been successfully submitted.",
                        icon: "success",
                        confirmButtonText: "Download Brochure",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const link = document.createElement("a");
                            link.href = "/assets/brochure.pdf"; // Replace with your file URL

                            link.download = "brochure.pdf"; // Set the download attribute with the file name
                            document.body.appendChild(link); // Append the link to the body
                            link.click(); // Trigger the download
                            document.body.removeChild(link); // Remove the link from the document

                            // Optionally, you can perform further actions here
                            console.log("File downloaded");
                        }
                    });
                    // Reset the form fields after successful submission
                    this.reset();
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: "Please check and submit again.",
                        icon: "error",
                    });
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                Swal.fire({
                    title: "Error!",
                    text: "There was an issue submitting the form. Please try again later.",
                    icon: "error",
                });
            });
        return false;
    });