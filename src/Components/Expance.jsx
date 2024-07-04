import React, { useState, useEffect } from "react";
import { MdSaveAlt, MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

const Expense = () => {
  const [thing, setThing] = useState("");
  const [price, setPrice] = useState("");
  const [show, setShow] = useState([]);
  const [Income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [Balance, setBalance] = useState(0);

  useEffect(() => {
    const savedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    setShow(savedTransactions);

    const savedIncome = parseFloat(localStorage.getItem("income")) || 0;
    setIncome(savedIncome);

    const savedExpense = parseFloat(localStorage.getItem("expense")) || 0;
    setExpense(savedExpense);

    const savedBalance = parseFloat(localStorage.getItem("balance")) || 0;
    setBalance(savedBalance);
  }, []);


  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(show));
    localStorage.setItem("income", JSON.stringify(Income));
    localStorage.setItem("expense", JSON.stringify(expense));
    localStorage.setItem("balance", JSON.stringify(Balance));
  }, [show, Income, expense, Balance]);

  const handleSave = () => {
    if (thing.trim() === "" || price.trim() === "") {
      return;
    }
    const timestamp = new Date().toLocaleString();
    const parsedPrice = parseFloat(price);
    const newTransaction = {
      id: uuidv4(),
      thing,
      price: parsedPrice,
      isCompleted: false,
      timestamp,
    };
    setShow([...show, newTransaction]);
    setIncome((prevIncome) =>
      parsedPrice >= 0 ? prevIncome + parsedPrice : prevIncome
    );
    setExpense((prevExpense) =>
      parsedPrice < 0 ? prevExpense - parsedPrice : prevExpense
    );
    setBalance((prevBalance) => prevBalance + parsedPrice);
    setThing("");
    setPrice("");
  };

  const handleDelete = (id) => {
    const itemToDelete = show.find((item) => item.id === id);
    const updatedShow = show.filter((item) => item.id !== id);

    if (itemToDelete) {
      const { price } = itemToDelete;

      setIncome((prevIncome) => (price >= 0 ? prevIncome - price : prevIncome));
      setExpense((prevExpense) =>
        price < 0 ? prevExpense - Math.abs(price) : prevExpense
      );
      setBalance((prevBalance) => prevBalance - price);
    }

    setShow(updatedShow);
  };

  const Clear = () => {
    setShow([]);
    setIncome(0);
    setExpense(0);
    setBalance(0);
  };

  return (
    <div className="max-w-screen-lg px-4 sm:px-6 lg:px-8 rounded-xl mx-auto my-3 p-5 bg-blue-400 min-h-[80vh] mb-10 mt-10 shadow-lg">
      {/* Title */}
      <h1 className="text-md sm:text-2xl font-bold text-center text-white shadow-2xl rounded-full p-3 bg-blue-300">
        Expense Tracker - Manage all your expenses on a single page
      </h1>
      {/* Balance section */}
      <div className="mt-10 w-3/4 bg-white sm:w-1/3 p-4 rounded-full">
        <p className="font-bold text-4xl text-blue-900 ml-3 ">Rs. {Balance}</p>
      </div>
      {/* Income and expense section */}
      <div className="total flex w-full sm:w-3/4 bg-white p-5 rounded-3xl mx-auto mt-10 shadow-2xl">
        <div className="flex-1 text-center border-r border-blue-300 pr-10 w-full">
          <h1 className="text-green-600 text-xl font-bold">Income</h1>
          <p className="text-blue-600 text-2xl font-bold">Rs {Income}/-</p>
        </div>
        <div className="flex-1 text-center pl-3 w-full">
          <h1 className="text-red-600 text-xl font-bold">Expense</h1>
          <p className="text-blue-600 text-2xl font-bold">Rs {expense}/-</p>
        </div>
      </div>
      {/* Transaction Heading */}
      <div className="flex items-center">
        <h1 className="w-full sm:w-1/4 font-bold text-lg mt-20 mb-5 text-center text-white shadow-2xl rounded-full p-3 bg-blue-300">
          Add new transaction
        </h1>
      </div>
      {/* Transaction section */}
      <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0">
        <div className="flex flex-col items-start w-full sm:w-1/3">
          <h1 className="ml-2 font-bold text-blue-100">Item Name</h1>
          <input
            type="text"
            className="w-full rounded-full my-2 py-3 px-4 focus:outline-none ring-2 ring-blue-500"
            placeholder="Item Description"
            value={thing}
            onChange={(e) => setThing(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-start w-full sm:w-1/3">
          <h1 className="ml-2 font-bold text-blue-100">Amount</h1>
          <input
            type="number"
            className="w-full rounded-full my-2 py-3 px-4 focus:outline-none ring-2 ring-blue-500"
            placeholder="(+)Income /(-)Expense + cost"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 p-3 text-purple-100 font-bold px-4 rounded-full"
          style={{ marginTop: "20px" }}
          onClick={handleSave}
        >
          <MdSaveAlt className="text-xl font-bold" />
        </button>
      </div>
      {/* History Heading */}
      <div className="flex items-center">
        <h1 className="w-full sm:w-1/4 font-bold text-lg mt-5 mb-5 text-center text-white shadow-2xl rounded-full p-3 bg-blue-300">
          History
        </h1>
      </div>
      {/* History section */}
      {show.map((item) => (
        <div
          className={`flex flex-col sm:flex-row gap-5 p-3 pl-7 mb-5 rounded-2xl sm:w-3/4 w-full shadow-2xl ${
            item.price >= 0 ? "bg-green-300" : "bg-red-300"
          }`}
          key={item.id}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
            <div className="flex flex-col sm:gap-10 sm:flex-row sm:items-center">
              <h1 className="sm:mr-3">
                Item : <span className="font-bold">{item.thing}</span>
              </h1>
              <h1 className="sm:mr-3">
                Price: <span className="font-bold">Rs {item.price}/-</span>{" "}
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-end mt-3 sm:mt-0">
              <div className="text-blue-900 text-sm sm:mr-3">
                {item.timestamp}
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 p-3 mx-1 rounded-full text-purple-100 text-sm font-bold"
                onClick={() => handleDelete(item.id)}
              >
                <MdDelete className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      ))}
      {show.length !== 0 && (
        <button
          className="bg-blue-500 hover:bg-blue-700 p-3 mx-1 rounded-full text-purple-100 text-sm font-bold mt-10"
          onClick={Clear}
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default Expense;
