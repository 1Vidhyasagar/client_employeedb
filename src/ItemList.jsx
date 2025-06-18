import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"
function ItemList() {
  const [items, setItems] = useState([]);

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  const fetchItems = async () => {
    const url =
      // eslint-disable-next-line no-constant-binary-expression
      "https://server-employeedb.onrender.com/api/items" ||
      "http://localhost:5000/api/items";
    const res = await axios.get(url, {
      params: { page, limit, search },
    });
    setItems(res.data.items);
    setTotal(res.data.total);
  };

  useEffect(() => {
    fetchItems();
  }, [page, search]);

  const handleAdd = async () => {
    const url =
      // eslint-disable-next-line no-constant-binary-expression
      "https://server-employeedb.onrender.com/api/items" ||
      "http://localhost:5000/api/items";

    await axios.post(url, {
      name: newName,
      description: newDesc,
    });
    setNewName("");
    setNewDesc("");
    fetchItems();
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditName(item.name);
    setEditDesc(item.description);
  };

  const handleSave = async (id) => {
    const url =
      // eslint-disable-next-line no-constant-binary-expression
      `https://server-employeedb.onrender.com/api/items/${id}` ||
      `http://localhost:5000/api/items/${id}`;
    await axios.put(url, {
      name: editName,
      description: editDesc,
    });
    setEditId(null);
    setEditName("");
    setEditDesc("");
    fetchItems();
  };

  const handleDelete = async (id) => {
    const url =
      // eslint-disable-next-line no-constant-binary-expression
      `https://server-employeedb.onrender.com/api/items/${id}` ||
      `http://localhost:5000/api/items/${id}`;
    await axios.delete(url);
    fetchItems();
  };

  return (
    <div className="py-6 max-w-md mx-auto">
      <h1 className="text-3xl font-semibold mb-3 text-center">
        Employee Database
      </h1>

      {/* ADD NEW */}
      <div className="mb-2 w-full">
        <input
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <input
          placeholder="Description"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 p-2 mt-1 text-gray-100 font-semibold rounded cursor-pointer"
        >
          Create
        </button>
      </div>

      {/* Search */}
      <input
        placeholder="Search by name"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="border p-2 mr-2 mb-3 rounded w-full"
      />

      {/* List + Actions */}
      <ul className="bg-gray-100 p-4 rounded">
        {items.length ? (
          items.map((item) => (
            <li
              key={item._id}
              className="flex justify-between items-center mb-2 p-2 bg-gray-50 rounded"
            >
              {editId === item._id ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border p-1 mr-2"
                  />
                  <input
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="border p-1 mr-2"
                  />
                  <button
                    onClick={() => handleSave(item._id)}
                    className="bg-green-500 p-1 mr-1 text-gray-100 cursor-pointer rounded"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span>
                    {item.name} - {item.description}
                  </span>
                  <div>
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-500 p-1 mr-1 cursor-pointer rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 p-1 text-gray-100 cursor-pointer rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        ) : (
          <li>No items</li>
        )}
      </ul>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="cursor-pointer"
        >
          Prev
        </button>

        <span>Page {page}</span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page * limit >= total}
          className="cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ItemList;
