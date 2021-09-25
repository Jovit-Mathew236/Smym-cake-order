import React, { useContext, useEffect, useState } from 'react'
import { FirebaseContext } from '../../store/Contexts'
import './Deliverdata.css'

function Deliverdata() {
    const [deliverNo, setDeliverNo] = useState(0)
    const [closedNo, setClosedNo] = useState(0)
    const [users, setUsers] = useState([])
    const [sectionD, setSectionD] = useState('Orders')
    const [inpStatus, setInpStatus] = useState(true)
    const { firebase } = useContext(FirebaseContext)
    const themeBtn = () => {
        var element = document.getElementById("themeId");
        element.classList.toggle("theme2");
        var ele = document.getElementById("body");
        ele.classList.toggle("body2")
    }

    const updateBal = () => {
        setInpStatus(true)
    }
    const editBal = () => {
        setInpStatus(false)
    }


    firebase.firestore().collection(sectionD + 2).doc("MdgtAnaVVDzYMAPgQJIP").get().then((res) => {
        setDeliverNo(res.data().Number)
        // console.log(res.data());
    })
    firebase.firestore().collection(sectionD + 2).doc("cnums").get().then((res) => {
        setClosedNo(res.data().Numbers)
        // console.log(res);
    }).catch((error) => {
        console.log(error.message);
    })
    useEffect(() => {
        // console.log(sectionD);
        firebase.firestore().collection(sectionD).get().then((snapshot) => {
            const alldocs = snapshot.docs.map((user) => {
                return {
                    ...user.data(),
                    id: user.id
                }
            })
            setUsers(alldocs)
        })
    })


    return (
        <div>
            <div className="parentDelivery">
                <h1>Delivery Data Page</h1>
                <button id="themeId" onClick={themeBtn} className="theme"><div></div></button>
                <div className="option">
                    <select name="section" value={sectionD} onChange={(e) => { (setSectionD(e.target.value)) }} id="section">
                        <option value="Orders">Select your Section</option>
                        <option value="Orders-plassanal">Plassanal</option>
                        <option value="Orders-Panakkapalam">Panakkapalam</option>
                        <option value="Orders-Place3">Place 3</option>
                        <option value="Orders-Place4">Place 4</option>
                    </select>
                </div>
                <div className="dataDiv" style={{ margin: "5rem 0rem" }}>
                    <div className="data T-Order">
                        <h2>Total Orders</h2>
                        <input type="text" value={users.length} disabled />
                    </div>
                    <div className="data D-Order">
                        <h2>Delivered Orders</h2>

                        <input type="text" value={deliverNo} disabled />

                    </div>
                    <div className="data C-Order">
                        <h2>Closed Orders</h2>
                        <input type="text" value={closedNo} disabled />
                    </div>
                </div>
                {/* <button onClick={Plasec}>click</button> */}
                <button className="editBtn" onClick={editBal}>Edit</button>
                <button className="subBtn" onClick={updateBal}>Submit</button>
                <div className="dataDivDl">
                    <div className="table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone No</th>
                                    <th>House</th>
                                    <th>Address</th>
                                    <th>Section</th>
                                    <th>Items</th>
                                    <th>Total Rs.</th>
                                    <th style={sectionD === "Orders" ? { display: "none" } : null}>Delivered ?</th>
                                    <th style={sectionD === "Orders" ? { display: "none" } : null}>Paid ?</th>
                                    <th style={sectionD === "Orders" ? { display: "none" } : null}>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => {
                                    return (<tr key={index}>
                                        <td>{user.Name}</td>
                                        <td>{user.Phone_No}</td>
                                        <td>{user.House_name}</td>
                                        <td>{user.Address}</td>
                                        <td>{user.Section}</td>

                                        <td>{user.Items.map((obj, index) => {
                                            return (
                                                <li key={index} style={{ listStyle: "none" }}>{index + 1} {" "} {obj.items} ({obj.kg}) [{obj.nos}]</li>
                                            )
                                        })}</td>
                                        <td>{user.Items[user.Items.length - 1].price}</td>
                                        <td style={sectionD === "Orders" ? { display: "none" } : null}><input disabled={user.Deliverd ? true : inpStatus} checked={user.Deliverd} onChange={(e) => {
                                            firebase.firestore().collection(sectionD).doc(user.id).update({
                                                Deliverd: e.target.checked
                                            })
                                            firebase.firestore().collection("Orders2").doc("MdgtAnaVVDzYMAPgQJIP").get().then((res) => {
                                                // console.log(res.data().Number);
                                                firebase.firestore().collection("Orders2").doc("MdgtAnaVVDzYMAPgQJIP").update({
                                                    Number: res.data().Number + 1
                                                })
                                            })
                                            firebase.firestore().collection(sectionD + 2).doc("MdgtAnaVVDzYMAPgQJIP").get().then((res) => {
                                                // console.log(res.data().Number);
                                                firebase.firestore().collection(sectionD + 2).doc("MdgtAnaVVDzYMAPgQJIP").update({
                                                    Number: res.data().Number + 1
                                                })
                                            })

                                        }} id="check" type="checkbox" /></td>
                                        <td style={sectionD === "Orders" ? { display: "none" } : null}><input disabled={user.Paid ? true : inpStatus} checked={user.Paid} onChange={(e) => {
                                            firebase.firestore().collection(sectionD).doc(user.id).update({
                                                Paid: e.target.checked,
                                            });
                                            firebase.firestore().collection("Orders2").doc("cnums").get().then((res) => {
                                                // console.log(res.data().Number);
                                                firebase.firestore().collection("Orders2").doc("cnums").update({
                                                    Numbers: res.data().Numbers + 1
                                                })
                                            })
                                            firebase.firestore().collection(sectionD + 2).doc("cnums").get().then((res) => {
                                                // console.log(res.data().Numbers);
                                                firebase.firestore().collection(sectionD + 2).doc("cnums").update({
                                                    Numbers: res.data().Numbers + 1
                                                })
                                            })
                                        }} type="checkbox" /></td>
                                        <td style={sectionD === "Orders" ? { display: "none", wordWrap: "break-word" } : null}><textarea onChange={(e) => {
                                            firebase.firestore().collection(sectionD).doc(user.id).update({
                                                Comment: e.target.value,
                                            })
                                        }} type="text" value={user.Comment} /></td>
                                    </tr>)

                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <button className="printBtn" onClick={window.print}>Print</button>


            </div>
        </div>
    )
}

export default Deliverdata
