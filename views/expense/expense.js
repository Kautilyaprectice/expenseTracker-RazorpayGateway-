const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");

function fetchExpenses() {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/expense', {headers: {'authorization': token}})
        .then((res) => {
            const expenses = res.data;
            expenseList.innerHTML = '';

            expenses.forEach((expense) => {
                appendExpenseToList(expense);
            });
        })
        .catch(err => {
            console.error('Error fetching expenses:', err);
        });
}

function appendExpenseToList(expense) {
    const listItem = document.createElement('li');
    listItem.textContent = `${expense.amount} - ${expense.description} - ${expense.category}  `;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Expense';
    deleteButton.onclick = () => {
        deleteExpense(expense.id);
    };

    listItem.appendChild(deleteButton);
    expenseList.appendChild(listItem);
}

expenseForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const formData = new FormData(expenseForm);
    const amount = formData.get('expenseAmount');
    const description = formData.get('description');
    const category = formData.get('category');

    axios.post('http://localhost:3000/expense', { amount, description, category }, {headers: {'authorization': token}})
        .then((res) => {
            fetchExpenses();
            expenseForm.reset();
        })
        .catch(err => {
            console.error('Error adding expense:', err);
        });
});

function deleteExpense(expenseId) {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3000/expense/${expenseId}`,  {headers: {'authorization': token}})
        .then((res) => {
            fetchExpenses();
        })
        .catch(err => {
            console.error('Error deleting expense:', err);
        });
}

const premiumButton = document.getElementById("rzp-button");
premiumButton.addEventListener("click", function (event) {
  const token = localStorage.getItem("token");
//   console.log(token); 
  axios
    .get("http://localhost:3000/purchase/premiumMembership", {
      headers: { Authorization: token },
    })
    .then((response) => {
      var options = {
        key: response.data.key_id,
        order_id: response.data.order.id,
        handler: function (response) {
          axios
            .post(
              "http://localhost:3000/purchase/updateTransactionStatus",
              {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
              },
              { headers: { Authorization: token } }
            )
            .then((response) => {
              alert("You are a premium user now");
              localStorage.setItem("token", response.data.token);
            })
            .catch((err) => {
              console.log(err);
            });
        },
      };
      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();
      razorpayInstance.on("payment.failed", function () {
        alert("Something went wrong");
      });
    })
    .catch((err) => {
      console.log(err);
    });

  event.preventDefault();
});

window.onload = fetchExpenses;
