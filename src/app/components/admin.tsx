"use client";
import React, { useEffect, useState } from "react";
import Adminstyles from "./Admin.module.css";
// import Header from "./header";
// import { useRequireAuth } from "../../../authCondition";


interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface Order{
  id:string;
  user:{
    id:string;
    name:string;
    email:string;

  };
  items:{
    id:number;
    title:string;
    price:number;
    quantity:number;
  }[];
  amount :number;
  status:string;
  createdAt:string;
}
function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <div
      className={`${Adminstyles.modalOverlay} ${isOpen ? Adminstyles.active : ""}`}
      onClick={onClose} 
    >
      <div
        className={Adminstyles.modalContent}
        onClick={(e) => e.stopPropagation()} 
      >
        <button className={Adminstyles.closeButton} onClick={onClose}>✖</button>
        {children}
      </div>
    </div>
  );
}

function AddUserForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  addMessage,
}: {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  addMessage: string;
}) {
  return (
    <>
      <h2>Add User</h2>
      {addMessage && <p className={Adminstyles.message}>{addMessage}</p>}
  <form onSubmit={onSubmit} className={Adminstyles.form}>
    
    <input type="text"
    placeholder="Name"
    className={Adminstyles.input}
    value={formData.name}
    onChange ={(e)=> setFormData({...formData,name:e.target.value})}
    required></input>
     <input
          type="email"
          placeholder="Email"
          className={Adminstyles.input}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <select
          className={Adminstyles.input}
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
        
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <div className={Adminstyles.actions}>
          <button type="submit" className={Adminstyles.button}>
            Add User
          </button>
          <button
            type="button"
            className={Adminstyles.cancelButton}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
         
    function EditUserForm({
      formData,
      setFormData,
      onSubmit,
      onCancel, 
      editMessage
    }:{
     formData:any;
     setFormData:React.Dispatch<React.SetStateAction<any>>;
     onSubmit:(e: React.FormEvent)=>void;
     onCancel:()=> void;
     editMessage:string;
    })
{
  return (
    <>
      <h2>Update User</h2>
      {editMessage && <p className={Adminstyles.message}>{editMessage}</p>}
      <form onSubmit={onSubmit} className={Adminstyles.form}>
        <input
          type="text"
          placeholder="Name"
          className={Adminstyles.input}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className={Adminstyles.input}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <select
          className={Adminstyles.input}
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <div className={Adminstyles.actions}>
          <button type="submit" className={Adminstyles.button}>
            Update User
          </button>
          <button
            type="button"
            className={Adminstyles.cancelButton}
            onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
function DeleteConfirm({
  onConfirm,
  onCancel,
  deleteMessage
}: {
  onConfirm: () => void;
  onCancel: () => void;
  deleteMessage:string;
}) {
  return (
    <>
      <h2>Confirm Delete</h2>
       {deleteMessage && <p className={Adminstyles.message}>{deleteMessage}</p>}
      <p>Are you sure you want to delete this user? This action cannot be undone.</p>
      <div className={Adminstyles.actions}>
        <button className={Adminstyles.delete} onClick={onConfirm}>
          Yes, Delete
        </button>
        <button className={Adminstyles.cancelButton} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </>
  );
}


export default function AdminPage() {
 // useRequireAuth();
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [addMessage,setAddMessage]= useState("");
  const [editMessage,setEditMessage]=useState("");
  const [deleteMessage,setDeleteMessage]=useState("");
  const [actionLoading,setActionLoading]=useState(false);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active",
  });

  async function fetchUsers() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        const mappedUsers = data.users.map((u: any) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status,
        }));
        setUsers(mappedUsers);
      } else {
        setMessage(data.error || "Failed to fetch users");
      }
    } catch {
      setMessage("Error fetching users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
    setActionLoading(true);
  try {
    const token = localStorage.getItem("token");
    const method = editingUserId ? "PUT" : "POST";
    const body = editingUserId
      ? { id: editingUserId, ...formData }
      : formData;

    const res = await fetch("/api/admin", {
      method,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (editingUserId) {
      setEditMessage(data.message || data.error);
      if (data.success) {
        fetchUsers();
        setTimeout(() => {
          resetForm();
          setEditMessage("");
        }, 1500);
      }
    } else {
      setAddMessage(data.message || data.error);
      if (data.success) {
        fetchUsers();
        setTimeout(() => {
          resetForm();
          setAddMessage("");
        }, 1500);
      }
    }
  } catch {
    if (editingUserId) {
      setEditMessage("Error updating user");
    } else {
      setAddMessage("Error adding user");
    }
     }
    finally{
      
    setActionLoading(false);
  } 

 
}
async function handleToggleStatus(userId: string, newStatus: "active" | "deactive") {
  setActionLoading(true);
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/admin", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: userId, status: newStatus }),
    });

    const data = await res.json();
    if (data.success) {
      await fetchUsers(); 
    } else {
      alert(data.error || "Error updating user status");
    }
  } catch (err) {
    alert("Error updating user status");
  } finally {
    setActionLoading(false);
  }
}

async function handleDelete(id: string) {
  setActionLoading(true); 
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/admin", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();

    if (data.success) {
      setDeleteMessage(data.message || "User deleted successfully");
      await fetchUsers();
      setDeleteUserId(null);
      setTimeout(() => setDeleteMessage(""), 1500);
    } else {
      setDeleteMessage(data.error || "Error deleting user");
    }
  } catch {
    setDeleteMessage("Error deleting user");
  } finally {
    setActionLoading(false); 
  }
}
const [selectedUser, setSelectedUser] = useState<User | null>(null);
const [orders, setOrders] = useState<Order[]>([]);
const [ordersLoading, setOrdersLoading] = useState(false);
const [showOrderModal, setOrderModal]=useState(false);


async function fetchOrders(userId: string, name: string, email: string) {
  try {
    setOrdersLoading(true);
    setSelectedUser({id: userId, name, email, role:"",status:""});

    const token = localStorage.getItem("token");
    const res = await fetch(`/api/orders?userId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (data.success) {
      const mappedOrders = data.orders.map((order: any) => ({
        id: order._id,
        user: {
          id: order.user._id,
          name: order.user.name,
          email: order.user.email,
        },
        items: order.items,
        amount: order.amount,
        status: order.status ?? "pending" ,
        createdAt: new Date(order.createdAt).toLocaleString(),
      }));
      setOrders(mappedOrders);
    } else {
      setOrders([]);
      return "no order is pending";
    }
    setOrderModal(true); 
  } catch {
    setOrders([]);
    setOrderModal(true);
  } finally {
    setOrdersLoading(false);
  }
}
async function handleUpdateOrderStatus(orderId: string, newStatus: string) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    });

    const data = await res.json();

    if (data.success) {
      if (selectedUser) {
        await fetchOrders(selectedUser.id, selectedUser.name, selectedUser.email);
      }
    } else {
      alert(data.error || "Failed to update order");
    }
  } catch (err) {
    alert("Error updating order status");
  }
}


  function handleEdit(user: User) {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  }

  function resetForm() {
    setFormData({
      name: "",
      email: "",
      role: "user",
      status: "active",
    });
    setEditingUserId(null);
    setShowForm(false);
  }


  return (
    <div className="page">
      {actionLoading && (
  <div className={Adminstyles.loaderOverlay}>
    <div className={Adminstyles.spinner}></div>
  </div>
)}
    {/* <Header /> */}
      <div className={Adminstyles.page}>
        {!showForm && !editingUserId && (
          <button
            className={Adminstyles.button}
            onClick={() => setShowForm(true)}>
            + Add User
          </button>
        )}
       <div className={Adminstyles.tabs}></div>
        <Modal isOpen={showForm || editingUserId !== null} onClose={resetForm}>
          {editingUserId ? (
            <EditUserForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              editMessage={editMessage}
              onCancel={resetForm}
             
            />
          ) : (
            <AddUserForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              addMessage={addMessage}
              onCancel={resetForm}
              
            />
          )}
        </Modal>
        <Modal
          isOpen={deleteUserId !== null}
          onClose={() => setDeleteUserId(null)}
        >
          <DeleteConfirm
            onConfirm={() => {
              if (deleteUserId) handleDelete(deleteUserId);
              
            }}
            deleteMessage={deleteMessage}
            onCancel={() => setDeleteUserId(null)}
            
          />
        </Modal>
        

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className={Adminstyles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {message && (
                <tr>
                  <td colSpan={5} className={Adminstyles.message}>
                    {message}
                  </td>
                </tr>
              )}
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.status}</td>
                  <td>
                  <button 
                  onClick={() => fetchOrders(u.id, u.name, u.email)
                  }
                  className={`${Adminstyles.actionButton}`}
                >
                  View Orders
                </button>

                    <button
                      onClick={() => handleEdit(u)}
                      className={`${Adminstyles.actionButton} ${Adminstyles.edit}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteUserId(u.id)}
                      className={`${Adminstyles.actionButton} ${Adminstyles.delete}`}
                    >
                      Delete
                    </button>
                     <button
    onClick={() => handleToggleStatus(u.id, u.status === "active" ? "deactive" : "active")}
    className={`${Adminstyles.actionButton} ${u.status === "active" ? Adminstyles.deactivate : Adminstyles.activate}`}
  >
    {u.status === "active" ? "Deactivate" : "Activate"}
  </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Modal isOpen={showOrderModal} onClose={()=>setOrderModal(false)}>
        {selectedUser && (
          <div >
            <h2 >Order history</h2>
            {ordersLoading?(
              <p>Loading Orders...</p>
            ):orders.length===0?(
              <p>No Orders found for this user</p>):
              (<table className={Adminstyles.table}>
              <thead>
                <tr>
                   <th>Items</th>
                 <th>Amount</th>
                  <th>Status</th>
                   <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      {order.items.map((i: any, idx: number) => (
                        <div key={idx}>
                          {i.title} x {i.quantity} (${i.price});
                        </div>
                      ))}
                    </td>
                    <td>${order.amount}</td>
                    <td>
                      {order.status}
                      {order.status === "pending" && (
                        <button
                          className={Adminstyles.actionButton}
                          onClick={() => handleUpdateOrderStatus(order.id, "paid")}>
                         Paid
                        </button>
                      )}
                    </td>
                    <td>{order.createdAt}</td>
                  </tr>
                ))}
              </tbody>
              </table>
            )}
            </div>
            )}
</Modal>
      </div>
    </div>
  );
}
