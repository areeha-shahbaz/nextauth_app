 "use client";

import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import Header from "./header";
import styles from "./RouteMap.module.css";

const customIcon = L.icon({
  iconUrl: "/marker-icon.png",  
  iconSize: [20, 35],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
export default function Map() {
  const [fromPlace, setFromPlace] = useState("");
  const [toPlace, setToPlace] = useState("");
  const [placeList, setPlacesList] = useState<string[]>([]);
  const [map, setMap] = useState<L.Map | null>(null);
  const [control, setControl] = useState<any>(null);
const [suggestions, setSuggestions] = useState<string[]>([]);
const [activeInput, setActiveInput]= useState<"from" | "to" |null>(null);
const [dropDownFrom, setDropDownFrom]= useState(false);
const [dropDownTo, setDropDownTo]= useState(false);
const [loading, setLoading]= useState(false);
const [history, setHistory]=useState<{id:string, from: string; to: string }[]>([]);
const [user,setUser]= useState<{id:string}| null>(null);

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return;

  const parsedUser = JSON.parse(storedUser);
  setUser(parsedUser);

  if (!parsedUser._id && !parsedUser.id) return;

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/history?userId=${parsedUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.map((item: any) => ({
    id: item._id,from: item.from, to: item.to })));

      }
    } catch (err) {
      console.error("Failed to load the history:", err);
    }
  };

  fetchHistory();
}, []);

useEffect(() => {
  const container = L.DomUtil.get("map");
  if (container != null) {
    (container as any)._leaflet_id = null;
  }

  const mapInstance = L.map("map",
    {
      zoomControl:true,
      scrollWheelZoom:true,
      dragging:true,
    }
  ).setView([30.3753, 69.3451], 5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(mapInstance);

  setMap(mapInstance);
    return () => {
    mapInstance.remove(); 
  };
}, []);

  const fetchSuggestions= async(query: string)=>{
    if(!query){
      setSuggestions([]);
      return
    };
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5`
    );
    const data = await res.json();
    const names = data.map((item: any) => item.display_name);
    setSuggestions(names);
  }
    useEffect(() => {
    const handler = setTimeout(() => {
      if (activeInput === "from") fetchSuggestions(fromPlace);
      if (activeInput === "to") fetchSuggestions(toPlace);
    }, 300); 

    return () => clearTimeout(handler);
  }, [fromPlace, toPlace, activeInput]);

  const geocode = async (place: string): Promise<[number, number] | null> => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
    );
    const data = await res.json();
    if (!data || data.length === 0) return null;
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  };

  const showRoute = async () => {
    if (!map) return;
    if (!fromPlace || !toPlace) return alert("Enter both from and to places");
    console.log(user,"user")
    if (!user?.id) {
     alert("User not found");
    return;}
 setLoading(true);
 try{
    const fromCoords = await geocode(fromPlace);
    const toCoords = await geocode(toPlace);

    if (!fromCoords || !toCoords) return alert("Could not find coordinates");

    setPlacesList([fromPlace, toPlace]);

    if (control) {
      map.removeControl(control);
    }

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(fromCoords[0], fromCoords[1]),
        L.latLng(toCoords[0], toCoords[1]),
      ],
      lineOptions: {
        styles: [{ color: "red", opacity: 0.8, weight: 5 }],
      },

      routeWhileDragging: false,
      createMarker: (i:any, waypoint: any) => {
    return L.marker(waypoint.latLng, { icon: customIcon });
  },
    }).addTo(map);

    setControl(routingControl);

    map.fitBounds(L.latLngBounds([
      [fromCoords[0], fromCoords[1]],
      [toCoords[0], toCoords[1]],
    ]));

 const res = await fetch("/api/history", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ userId: user.id , from: fromPlace, to: toPlace }),
});

if (res.ok) {
  const data = await res.json();
  setHistory((prev) => [...prev, { id: data.id, from: fromPlace, to: toPlace }]);
}

 }
  
  finally{
    setLoading(false);
  };
  }
const deleteHistory = async (historyId: string) => {
  try {
    const res = await fetch(`/api/history?id=${historyId}`, {
      method: "DELETE",
      });

    if (res.ok) {
      setHistory((prev) => prev.filter((h) => h.id !==historyId));
    } else {
      const error = await res.json();
      alert(error.error || "Failed to delete history");
    }
  } catch (err) {
    console.error("Error deleting history:", err);
  }
};
  const handleSelectSuggestion=(name:string)=>{
    if(activeInput==="from") setFromPlace(name);
    if(activeInput==="to") setToPlace(name);
    setSuggestions([]);
  };

  return (
  <div className={styles.container}>
    <Header />
    <div className={styles.layout}>
      <div className={styles.leftPanel}>
        <h3>Selected Places</h3>
         <ul>
  {history.map((item, i) => (
    <li
      key={i}
      style={{
        position: "relative",
        padding: "8px 30px 8px 8px", 
        border: "1px solid #ddd",
        marginBottom: "6px",
        borderRadius: "6px",
      }}
    >
      {item.from} → {item.to}
      <button
        style={{
          position: "absolute",
          top: "4px",
          right: "6px",
          border: "none",
          background: "transparent",
          color: "grey",
          fontSize: "10px",
          cursor: "pointer",
        }}
        onClick={() => deleteHistory(item.id)}>
        ❌
      </button>
    </li>
  ))}
</ul>

      </div>
    </div>

    <div className={styles.mapWrapper}>
      <div className={styles.inputs}>
        
        <div style={ {position: "relative"}}>
        <input
          type="text"
          placeholder="From"
          value={fromPlace}
          onFocus={() => {
            setActiveInput("from");
            setDropDownFrom(true);
          }}
          onChange={(e) => setFromPlace(e.target.value)}
          onBlur={() =>
            setTimeout(()=> setDropDownFrom(false),150)
          }
        />
        { activeInput==="from" && suggestions.length > 0 && (
         <ul className={`${styles.suggestions} ${!dropDownFrom ? styles.hidden : ""}`}
         onMouseEnter={()=> setDropDownFrom(true)}
            onMouseLeave={()=> setDropDownFrom(false)}>

           {suggestions.map((s,i)=>(
            <li key ={i} onMouseDown={()=> handleSelectSuggestion(s)}>{s}</li>
           ))}
          </ul>
              )}
              </div>
              <div style={{position: "relative"}}>
        <input
          type="text"
          placeholder="To"
          value={toPlace}
          onFocus={()=>{
            setActiveInput("to");
           setDropDownTo(true);
          }}
          onChange={(e) => setToPlace(e.target.value)}
           onBlur={() =>
            setTimeout(()=> setDropDownTo(false),100)
          }
        />
         { activeInput==="to" && suggestions.length > 0 && (
          <ul className={`${styles.suggestions} ${!dropDownTo ? styles.hidden : ""}`}
            onMouseEnter={()=> setDropDownTo(true)}
            onMouseLeave={()=> setDropDownTo(false)}>

           {suggestions.map((s,i)=>(
            <li key ={i} onMouseDown={()=> handleSelectSuggestion(s)}>{s}</li>
           ))}
          </ul>
              )}
              </div>
        <button onClick={showRoute}>Show Route</button>
      </div>

      <div className={styles.mapContainer} id="map" />
      {loading && (
        <div className={styles.loader}>
          Calculating Route...</div>
      
      )}
    </div>
  </div>

  );
}

