import React, { createContext, useContext, useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import api from './api';

const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);
const money = (n, c='INR') => new Intl.NumberFormat('en-IN', { style: 'currency', currency: c, maximumFractionDigits: 2 }).format(Number(n || 0));
function App() {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('remarket_user')); } catch { return null; } });
  const login = (data) => { localStorage.setItem('remarket_token', data.token); localStorage.setItem('remarket_user', JSON.stringify(data.user)); setUser(data.user); };
  const logout = () => { localStorage.removeItem('remarket_token'); localStorage.removeItem('remarket_user'); setUser(null); };
  return <AuthContext.Provider value={{ user, login, logout }}>
    <Navbar />
    <main className="container page-wrap">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:type" element={<Products />} />
        <Route path="/requirements" element={<Requirements />} />
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Footer />
  </AuthContext.Provider>;
}
function Navbar() {
  const { user, logout } = useAuth();
  return <nav className="navbar navbar-expand-lg navbar-dark site-nav sticky-top"><div className="container">
    <Link className="navbar-brand fw-bold" to="/"><span className="brand-icon"><i className="bi bi-recycle"/></span> ReMarket</Link>
    <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav"><span className="navbar-toggler-icon"/></button>
    <div className="collapse navbar-collapse" id="nav">
      <div className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
        <NavLink className="nav-link" to="/products">Marketplace</NavLink>
        <NavLink className="nav-link" to="/products/first-hand">First-hand</NavLink>
        <NavLink className="nav-link" to="/products/second-hand">Second-hand</NavLink>
        <NavLink className="nav-link" to="/products/third-hand">Third-hand</NavLink>
        <NavLink className="nav-link" to="/products/scrap">E-Scrap</NavLink>
        <NavLink className="nav-link" to="/requirements">Bulk RFQs</NavLink>
        <NavLink className="nav-link" to="/auctions">Auctions</NavLink>
        {user ? <><NavLink className="nav-link" to={user.role === 'admin' ? '/admin' : '/dashboard'}>Dashboard</NavLink><button className="btn btn-sm btn-outline-light ms-lg-2" onClick={logout}>Log out</button></> :
        <><Link className="nav-link" to="/login">Log in</Link><Link className="btn btn-teal btn-sm ms-lg-2" to="/register">Join ReMarket</Link></>}
      </div>
    </div>
  </div></nav>;
}
function Home() {
  const [q,setQ]=useState('');
  const navigate=useNavigate();
  return <><section className="hero-section">
    <div className="hero-grid"><div><span className="eyebrow"><i className="bi bi-globe2 me-2"/>GLOBAL B2B ELECTRONICS TRADE</span>
      <h1>Source smarter.<br/><span>Trade circular.</span></h1>
      <p className="hero-copy">One marketplace for new electronics, pre-owned equipment, bulk sourcing, auctions and electronic scrap.</p>
      <form className="hero-search" onSubmit={e=>{e.preventDefault();navigate(`/products?q=${encodeURIComponent(q)}`)}}><i className="bi bi-search"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search laptops, servers, suppliers..."/><button className="btn btn-teal">Search</button></form>
      <div className="hero-actions"><Link className="btn btn-teal btn-lg" to="/requirements"><i className="bi bi-file-earmark-text me-2"/>Post a bulk requirement</Link><Link className="btn btn-outline-light btn-lg" to="/products">Browse products <i className="bi bi-arrow-up-right ms-1"/></Link></div>
      <div className="hero-proof"><span><i className="bi bi-check-circle-fill"/> Bulk sourcing</span><span><i className="bi bi-check-circle-fill"/> Multiple product lifecycles</span><span><i className="bi bi-check-circle-fill"/> Business-to-business</span></div>
    </div><div className="hero-visual"><div className="visual-glow"/><div className="device device-laptop"><i className="bi bi-laptop"/></div><div className="device device-phone"><i className="bi bi-phone"/></div><div className="device device-chip"><i className="bi bi-cpu"/></div><div className="floating-card"><span className="pulse-dot"/> <b>Bulk sourcing made easier</b><small>Post once. Receive supplier offers.</small></div><div className="visual-label">BUY · SELL · REUSE · RECYCLE</div></div>
    </div></section>
    <section className="stats-strip row g-0"><div className="col-6 col-md-3 stat"><b>01</b><span>Discover products</span></div><div className="col-6 col-md-3 stat"><b>02</b><span>Post bulk requirements</span></div><div className="col-6 col-md-3 stat"><b>03</b><span>Compare quotations</span></div><div className="col-6 col-md-3 stat"><b>04</b><span>Trade responsibly</span></div></section>
    <section className="section-pad"><div className="section-heading"><div><span className="eyebrow dark">EXPLORE MARKETPLACE</span><h2>Every electronics lifecycle.</h2><p>From brand-new inventory to parts ready for recovery.</p></div><Link to="/products" className="text-link">View all products <i className="bi bi-arrow-right"/></Link></div>
      <div className="row g-3">{[
      ['bi-box-seam','First-hand electronics','New stock from manufacturers and distributors','first-hand','Fresh inventory'],
      ['bi-arrow-repeat','Second-hand electronics','Pre-owned equipment with disclosed condition','second-hand','Value finds'],
      ['bi-tools','Third-hand electronics','Previously resold devices for reuse or repair','third-hand','Circular reuse'],
      ['bi-recycle','Electronic scrap','Materials, components and recyclable lots','scrap','Recover value']
      ].map((c,i)=><div className="col-12 col-md-6 col-xl-3" key={c[3]}><Link className={`category-card cat-${i}`} to={`/products/${c[3]}`}><div className="category-top"><span className="category-icon"><i className={`bi ${c[0]}`}/></span><span className="category-index">0{i+1}</span></div><span className="category-kicker">{c[4]}</span><h3>{c[1]}</h3><p>{c[2]}</p><span className="category-arrow"><i className="bi bi-arrow-up-right"/></span></Link></div>)}</div>
    </section>
    <section className="rfq-banner"><div><span className="eyebrow">FOR BUSINESS BUYERS</span><h2>Need 1,000 computers?<br/>Let suppliers come to you.</h2><p>Publish your quantity, specifications and delivery location. Suppliers can respond with quotations you can compare.</p><Link className="btn btn-teal btn-lg" to="/requirements">Explore bulk requirements <i className="bi bi-arrow-right ms-2"/></Link></div><div className="rfq-art"><i className="bi bi-clipboard2-check"/><div className="rfq-mini"><i className="bi bi-check-circle-fill"/> Supplier offers received <b>Compare options</b></div></div></section>
    <section className="section-pad how-section"><div className="section-heading"><div><span className="eyebrow dark">HOW IT WORKS</span><h2>A better way to source.</h2></div></div><div className="row g-4">{[['01','Discover','Search products or browse supplier listings.'],['02','Request','Post a bulk requirement with your specifications.'],['03','Compare','Review offers, quantities and delivery terms.'],['04','Connect','Contact businesses directly to arrange a deal.']].map(x=><div className="col-6 col-lg-3" key={x[0]}><div className="step-card"><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></div></div>)}</div></section>
  </>;
}
function Products() {
  const { user }=useAuth(); const [items,setItems]=useState([]),[q,setQ]=useState(''),[loading,setLoading]=useState(true),[error,setError]=useState('');
  const type=window.location.pathname.split('/')[2] || '';
  const load=async()=>{setLoading(true);try{const r=await api.get('/products',{params:{lifecycle:['first-hand','second-hand','third-hand','scrap'].includes(type)?type:undefined,q:q||undefined}});setItems(r.data.items);setError('')}catch(e){setError(e.response?.data?.message||'Could not load products. Is the API running?')}finally{setLoading(false)}};
  useEffect(()=>{load()},[type]);
  return <><PageHeader kicker="THE MARKETPLACE" title={type?({ 'first-hand':'First-hand electronics','second-hand':'Second-hand electronics','third-hand':'Third-hand electronics','scrap':'Electronic scrap & recycling'}[type]||'Marketplace'):'Marketplace'} desc="Explore approved electronics listings from businesses."/>
    <form className="filter-bar mb-4" onSubmit={e=>{e.preventDefault();load()}}><i className="bi bi-search"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products or categories"/><button className="btn btn-darkblue">Search</button></form>
    {user && ['supplier','recycler','admin'].includes(user.role)&&<ProductForm onCreated={load}/>}
    {loading?<Loading/>:error?<ErrorMessage text={error}/>:items.length===0?<Empty title="No approved listings yet" text="When suppliers publish listings and an admin approves them, they will appear here."/>:<div className="row g-3">{items.map(p=><div className="col-md-6 col-xl-4" key={p._id}><ProductCard p={p}/></div>)}</div>}
  </>;
}

function imageSrc(url) {
  if (!url) return '';

  if (/^https?:\/\//i.test(url)) return url;

  const apiBase = (
    import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  ).replace(/\/api\/?$/, '');

  return `${apiBase}${url.startsWith('/') ? url : `/${url}`}`;
}


function ProductCard({p}) {
  const { user } = useAuth();
  const seller = p.seller || {};
  const [ordering, setOrdering] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');
  const placeOrder = async () => {
    if (!user) { setOrderMessage('Please log in as a buyer to order.'); return; }
    if (user.role !== 'buyer') { setOrderMessage('Only buyer accounts can place orders.'); return; }
    if (String(seller._id || seller.id || '') === String(user._id || user.id || '')) { setOrderMessage('You cannot order your own listing.'); return; }
    const raw = window.prompt(`Enter quantity to order (available: ${p.quantity}, minimum: ${p.minOrderQuantity || 1})`, String(p.minOrderQuantity || 1));
    if (raw === null) return;
    const quantity = Number(raw);
    if (!Number.isInteger(quantity) || quantity < (p.minOrderQuantity || 1) || quantity > p.quantity) {
      setOrderMessage(`Enter a whole number from ${p.minOrderQuantity || 1} to ${p.quantity}.`); return;
    }
    if (!window.confirm(`Confirm order for ${quantity} × ${p.title}?`)) return;
    setOrdering(true); setOrderMessage('');
    try {
      const result = await api.post('/orders', { productId: p._id, quantity });
      setOrderMessage(result.data.message || 'Order placed. Supplier notified.');
    } catch (e) { setOrderMessage(e.response?.data?.message || 'Could not place order.'); }
    finally { setOrdering(false); }
  };
  return <article className="product-card"><div className="product-photo">{p.imageUrl?<img src={imageSrc(p.imageUrl)} alt={p.title} onError={e=>{e.currentTarget.style.display="none"}}/>:<i className={`bi ${p.lifecycle==='scrap'?'bi-recycle':'bi-cpu'}`}/>}<span className="product-condition">{p.lifecycle}</span></div><div className="product-body"><div className="product-category">{p.category}</div><h3>{p.title}</h3><p className="product-desc">{p.description}</p><div className="product-price">{money(p.price,p.currency)} <small>/ unit</small></div><div className="product-meta"><span><i className="bi bi-box-seam"/> Qty: {p.quantity}</span><span><i className="bi bi-geo-alt"/> {p.location||'Location not listed'}</span></div><div className="seller-row"><div className="seller-avatar">{(seller.company||seller.name||'S').slice(0,1).toUpperCase()}</div><div><b>{seller.company||seller.name||'Supplier'}</b><small>Marketplace seller</small></div></div><div className="contact-row">{seller.phone&&<a href={`tel:${seller.phone}`}><i className="bi bi-telephone"/> Call</a>}{seller.whatsapp&&<a target="_blank" rel="noreferrer" href={`https://wa.me/${seller.whatsapp.replace(/\D/g,'')}`}><i className="bi bi-whatsapp"/> WhatsApp</a>}{seller.email&&<a href={`mailto:${seller.email}`}><i className="bi bi-envelope"/> Email</a>}</div><button className="btn btn-teal w-100 mt-3" disabled={ordering || p.quantity < (p.minOrderQuantity || 1)} onClick={placeOrder}><i className="bi bi-bag-check me-2"/>{ordering?'Placing order...':'Order now'}</button>{orderMessage&&<div className="small mt-2" role="status">{orderMessage}</div>}</div></article>;
}
function ProductForm({onCreated}) {
 const [open,setOpen]=useState(false),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[preview,setPreview]=useState('');
 const submit=async e=>{e.preventDefault();setBusy(true);setMessage('');const form=e.currentTarget;const f=new FormData(form);f.set('price',String(Number(f.get('price'))));f.set('quantity',String(Number(f.get('quantity'))));f.set('minOrderQuantity',String(Number(f.get('minOrderQuantity')||1)));try{await api.post('/products',f,{headers:{'Content-Type':'multipart/form-data'}});setMessage('Listing submitted for admin approval.');form.reset();setPreview('');onCreated()}catch(err){setMessage(err.response?.data?.message||'Could not submit listing.')}finally{setBusy(false)}};
 const selectImage=e=>{const file=e.target.files?.[0];if(file){if(preview)URL.revokeObjectURL(preview);setPreview(URL.createObjectURL(file))}else setPreview('')};
 return <div className="create-panel mb-4"><button className="btn btn-teal" onClick={()=>setOpen(!open)}><i className="bi bi-plus-lg me-2"/>Create product listing</button>{open&&<form className="row g-3 mt-1" onSubmit={submit} encType="multipart/form-data"><Field label="Product title" name="title" required/><Field label="Category" name="category" required/><div className="col-md-4"><label className="form-label">Listing type</label><select name="lifecycle" className="form-select"><option value="first-hand">First-hand</option><option value="second-hand">Second-hand</option><option value="third-hand">Third-hand</option><option value="scrap">Electronic scrap</option></select></div><Field label="Price per unit (INR)" name="price" type="number" required/><Field label="Quantity" name="quantity" type="number" required/><Field label="Minimum order quantity" name="minOrderQuantity" type="number"/><Field label="Location" name="location"/><Field label="Warranty (optional)" name="warranty"/><div className="col-12"><label className="form-label">Product image (optional)</label><div className="d-flex flex-wrap align-items-center gap-3"><label className="btn btn-outline-secondary mb-0"><i className="bi bi-upload me-2"/>Choose image from computer<input className="d-none" type="file" name="image" accept="image/png,image/jpeg,image/webp,image/gif" onChange={selectImage}/></label><span className="small text-secondary">JPG, PNG, WEBP or GIF · Max 5 MB</span></div>{preview&&<div className="mt-3"><img src={preview} alt="Selected product preview" style={{width:160,height:120,objectFit:'cover',borderRadius:12,border:'1px solid #dbe3e8'}}/><button type="button" className="btn btn-sm btn-link text-danger d-block px-0" onClick={()=>{setPreview('');const input=document.querySelector('input[name="image"]');if(input)input.value=''}}>Remove image</button></div>}</div><div className="col-12"><label className="form-label">Description</label><textarea className="form-control" name="description" required rows="3"/></div><div className="col-12"><button disabled={busy} className="btn btn-darkblue">{busy?'Uploading and submitting...':'Submit for approval'}</button> {message&&<span className="ms-3 small">{message}</span>}</div></form>}</div>;
}
function Requirements() {
 const {user}=useAuth(); const [items,setItems]=useState([]),[q,setQ]=useState(''),[error,setError]=useState(''),[show,setShow]=useState(false),[msg,setMsg]=useState('');
 const load=async()=>{try{const r=await api.get('/requirements',{params:{q:q||undefined}});setItems(r.data);setError('')}catch(e){setError(e.response?.data?.message||'Log in to view buyer requirements.')}};
 useEffect(()=>{if(user)load()},[user]);
 const create=async e=>{e.preventDefault();setMsg('');const f=new FormData(e.currentTarget),b=Object.fromEntries(f.entries());b.quantity=Number(b.quantity);b.targetPrice=b.targetPrice?Number(b.targetPrice):null;b.partialFulfilment=b.partialFulfilment==='on';try{await api.post('/requirements',b);setMsg('Requirement published.');e.currentTarget.reset();setShow(false);load()}catch(e){setMsg(e.response?.data?.message||'Could not publish requirement.')}};
 return <><PageHeader kicker="REQUEST FOR QUOTATION" title="Bulk buyer requirements" desc="Buyers post what they need. Suppliers respond with offers and delivery terms."/>
 {user?.role==='buyer'&&<div className="mb-4"><button className="btn btn-teal btn-lg" onClick={()=>setShow(!show)}><i className="bi bi-plus-circle me-2"/>Post a bulk requirement</button>{show&&<form className="form-panel row g-3 mt-2" onSubmit={create}><Field label="Requirement title" name="title" placeholder="e.g. 1,000 used desktop computers" required/><Field label="Category" name="category" placeholder="Computers" required/><Field label="Quantity needed" name="quantity" type="number" required/><div className="col-md-6"><label className="form-label">Condition</label><select className="form-select" name="condition"><option>Any</option><option>New</option><option>Excellent</option><option>Good</option><option>Fair</option><option>For Parts</option></select></div><Field label="Target price per unit (optional)" name="targetPrice" type="number"/><Field label="Currency" name="currency" defaultValue="INR"/><Field label="Delivery location" name="deliveryLocation" required/><Field label="Deadline (optional)" name="deadline" type="date"/><div className="col-12"><label className="form-label">Specifications / description</label><textarea className="form-control" name="description" rows="3" required placeholder="Mention models, RAM, storage, testing and warranty requirements."/></div><div className="col-12"><label><input type="checkbox" name="partialFulfilment" className="form-check-input me-2"/>Allow multiple suppliers to fulfil this requirement</label></div><div className="col-12"><button className="btn btn-darkblue">Publish requirement</button> {msg&&<span className="ms-2 small">{msg}</span>}</div></form>}</div>}
 {user?.role==='supplier'&&<div className="alert alert-info">Browse open requests and send quotations. Sign in as a buyer to publish a requirement.</div>}
 {!user?<div className="empty-state"><i className="bi bi-lock"/><h3>Sign in to explore buyer requirements</h3><p>Supplier accounts can view open RFQs and send quotations.</p><Link className="btn btn-teal" to="/login">Log in</Link></div>:error?<ErrorMessage text={error}/>:items.length===0?<Empty title="No requirements found" text="Buyer requests will appear here when available."/>:<div className="row g-3">{items.map(r=><div className="col-12" key={r._id}><RequirementCard r={r} reload={load}/></div>)}</div>}
 </>;
}
function RequirementCard({r,reload}) {
 const {user}=useAuth(); const [show,setShow]=useState(false),[msg,setMsg]=useState('');
 const quote=async e=>{e.preventDefault();const f=new FormData(e.currentTarget),b=Object.fromEntries(f.entries());b.offeredQuantity=Number(b.offeredQuantity);b.unitPrice=Number(b.unitPrice);b.shippingCost=Number(b.shippingCost||0);b.deliveryDays=Number(b.deliveryDays||0);try{await api.post(`/requirements/${r._id}/quotations`,b);setMsg('Quotation submitted.');setShow(false)}catch(e){setMsg(e.response?.data?.message||'Could not submit quotation.')}};
 return <article className="requirement-card"><div className="requirement-main"><div className="d-flex flex-wrap gap-2 mb-2"><span className="status-pill">{r.status}</span><span className="category-pill">{r.category}</span></div><h3>{r.title}</h3><p>{r.description}</p><div className="requirement-meta"><span><i className="bi bi-box-seam"/> {r.quantity.toLocaleString()} units</span><span><i className="bi bi-geo-alt"/> {r.deliveryLocation}</span><span><i className="bi bi-calendar3"/> {r.deadline?new Date(r.deadline).toLocaleDateString():'Flexible deadline'}</span>{r.targetPrice!=null&&<span><i className="bi bi-cash"/> Target {money(r.targetPrice,r.currency)}</span>}</div><div className="small text-secondary mt-3">Posted by {r.buyer?.company||r.buyer?.name||'Buyer'}</div></div><div className="requirement-actions">{user?.role==='supplier'||user?.role==='recycler'?<button className="btn btn-teal" onClick={()=>setShow(!show)}>Send quotation</button>:null}{msg&&<small className="d-block mt-2">{msg}</small>}</div>
 {show&&<form className="quote-form row g-2" onSubmit={quote}><Field label="Quantity offered" name="offeredQuantity" type="number" required/><Field label="Unit price (INR)" name="unitPrice" type="number" required/><Field label="Shipping cost" name="shippingCost" type="number"/><Field label="Delivery days" name="deliveryDays" type="number"/><Field label="Warranty" name="warranty"/><div className="col-md-6"><label className="form-label">Message</label><input className="form-control" name="message" placeholder="Offer details"/></div><div className="col-12"><button className="btn btn-darkblue">Submit offer</button></div></form>}
 </article>;
}
function Auctions() {
 const {user}=useAuth();const [items,setItems]=useState([]),[show,setShow]=useState(false),[msg,setMsg]=useState(''),[error,setError]=useState('');
 const load=async()=>{try{const r=await api.get('/auctions');setItems(r.data);setError('')}catch(e){setError('Could not load auctions.')}};
 useEffect(()=>{load()},[]);
 const create=async e=>{e.preventDefault();const f=new FormData(e.currentTarget),b=Object.fromEntries(f.entries());['quantity','startingBid','reservePrice','minIncrement'].forEach(k=>b[k]=b[k]?Number(b[k]):undefined);try{await api.post('/auctions',b);setMsg('Auction created.');setShow(false);e.currentTarget.reset();load()}catch(e){setMsg(e.response?.data?.message||'Could not create auction.')}};
 const bid=async id=>{const amount=prompt('Enter your bid amount (INR):');if(!amount)return;try{const r=await api.post(`/auctions/${id}/bids`,{amount:Number(amount)});alert(r.data.message);load()}catch(e){alert(e.response?.data?.message||'Bid failed.')}};
 return <><PageHeader kicker="LIVE BIDDING" title="Electronics auctions" desc="Bid on eligible electronics lots and surplus inventory. Contact sellers to arrange any transaction; payments are not processed here."/>
 {user&&['supplier','recycler','admin'].includes(user.role)&&<button className="btn btn-teal mb-4" onClick={()=>setShow(!show)}><i className="bi bi-plus-lg me-2"/>Create auction</button>}
 {show&&<form className="form-panel row g-3 mb-4" onSubmit={create}><Field label="Auction title" name="title" required/><Field label="Category" name="category" required/><Field label="Quantity" name="quantity" type="number" required/><Field label="Starting bid (INR)" name="startingBid" type="number" required/><Field label="Minimum increment" name="minIncrement" type="number" defaultValue="100"/><Field label="Reserve price (optional)" name="reservePrice" type="number"/><Field label="Starts at" name="startsAt" type="datetime-local" required/><Field label="Ends at" name="endsAt" type="datetime-local" required/><div className="col-12"><label className="form-label">Description</label><textarea name="description" className="form-control" required/></div><div className="col-12"><button className="btn btn-darkblue">Publish auction</button> {msg}</div></form>}
 {error?<ErrorMessage text={error}/>:items.length===0?<Empty title="No auctions yet" text="Approved auction opportunities will be shown here."/>:<div className="row g-3">{items.map(a=><div className="col-md-6 col-xl-4" key={a._id}><article className="auction-card"><div className="auction-art"><i className="bi bi-hammer"/><span>{a.status}</span></div><div className="p-4"><span className="category-pill">{a.category}</span><h3 className="mt-2">{a.title}</h3><p className="text-secondary">{a.description}</p><div className="d-flex justify-content-between py-2 border-bottom"><span>Starting bid</span><b>{money(a.startingBid)}</b></div><div className="d-flex justify-content-between py-2 border-bottom"><span>Current bid</span><b>{a.highestBid==null?'No bids':money(a.highestBid)}</b></div><div className="d-flex justify-content-between py-2"><span>Ends</span><b>{new Date(a.endsAt).toLocaleString()}</b></div>{user?.role==='buyer'&&<button className="btn btn-teal w-100 mt-2" disabled={a.status!=='active'} onClick={()=>bid(a._id)}>Place bid</button>}<small className="text-secondary d-block mt-2">Seller: {a.seller?.company||a.seller?.name}</small></div></article></div>)}</div>}
 </>;
}
function AuthPage({mode}) {
 const {login}=useAuth(),navigate=useNavigate(),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const register=mode==='register';
 const submit=async e=>{e.preventDefault();setBusy(true);setError('');const f=new FormData(e.currentTarget),body=Object.fromEntries(f.entries());try{const r=await api.post(`/auth/${register?'register':'login'}`,body);login(r.data);navigate(r.data.user.role==='admin'?'/admin':'/dashboard')}catch(e){setError(e.response?.data?.message||'Unable to continue.')}finally{setBusy(false)}};
 return <div className="auth-layout"><div className="auth-aside"><span className="eyebrow">WELCOME TO REMARKET</span><h2>Good business starts with the right connection.</h2><p>Discover supply, publish demand and connect with electronics businesses.</p><div className="auth-benefit"><i className="bi bi-shield-check"/> Role-based business accounts</div><div className="auth-benefit"><i className="bi bi-arrow-left-right"/> Product trading and bulk RFQs</div><div className="auth-benefit"><i className="bi bi-recycle"/> Circular electronics economy</div></div><form className="auth-form" onSubmit={submit}><h1>{register?'Create your account':'Welcome back'}</h1><p>{register?'Join the electronics business marketplace.':'Log in to your ReMarket workspace.'}</p>{register&&<><Field label="Full name" name="name" required/><Field label="Company name (optional)" name="company"/><Field label="Phone (optional)" name="phone"/><Field label="WhatsApp number (optional)" name="whatsapp"/></>}<Field label="Email address" name="email" type="email" required/><Field label="Password" name="password" type="password" required/><input type="hidden" name="role" value="buyer"/>{register&&<div className="mb-3"><label className="form-label">Account type</label><select name="role" className="form-select" defaultValue="buyer"><option value="buyer">Buyer</option><option value="supplier">Supplier</option><option value="recycler">Recycler / scrap trader</option></select></div>}{error&&<div className="alert alert-danger py-2">{error}</div>}<button className="btn btn-teal w-100 py-2" disabled={busy}>{busy?'Please wait...':register?'Create account':'Log in'}</button><div className="auth-switch">{register?'Already registered?':'New to ReMarket?'} <Link to={register?'/login':'/register'}>{register?'Log in':'Create an account'}</Link></div><small className="text-secondary d-block mt-3">Email verification is not yet configured in this starter version.</small></form></div>;
}
function Dashboard() {
 const {user}=useAuth();
 const [products,setProducts]=useState([]),[requirements,setRequirements]=useState([]),[orders,setOrders]=useState([]),[notifications,setNotifications]=useState([]),[msg,setMsg]=useState('');
 const loadOrders=async()=>{try{const r=await api.get('/orders/mine');setOrders(r.data)}catch{setOrders([])}};
 const loadNotifications=async()=>{try{const r=await api.get('/notifications');setNotifications(r.data)}catch{setNotifications([])}};
 useEffect(()=>{if(!user)return;api.get('/products/mine').then(r=>setProducts(r.data)).catch(()=>{});api.get('/requirements').then(r=>setRequirements(r.data)).catch(()=>{});loadOrders();if(['supplier','recycler','admin'].includes(user.role))loadNotifications()},[user]);
 if(!user)return <NeedLogin/>;
 const updateOrder=async(id,status)=>{try{await api.patch(`/orders/${id}/status`,{status});setMsg(`Order marked ${status}.`);loadOrders();loadNotifications()}catch(e){setMsg(e.response?.data?.message||'Could not update order.')}};
 const markRead=async(id)=>{try{await api.patch(`/notifications/${id}/read`);loadNotifications()}catch{}};
 return <><PageHeader kicker="YOUR WORKSPACE" title={`Hello, ${user.name.split(' ')[0]}`} desc="Manage your business activity, orders and marketplace listings."/><div className="row g-3 mb-4"><StatCard label="Account type" value={user.role}/><StatCard label="Your products" value={products.length}/><StatCard label={user.role==='buyer'?'Your orders':'Orders received'} value={orders.length}/></div>{msg&&<div className="alert alert-info">{msg}</div>}
 {['supplier','recycler','admin'].includes(user.role)&&<div className="dashboard-panel mb-4"><div className="d-flex justify-content-between align-items-center"><h3><i className="bi bi-bell me-2"/>Supplier notifications</h3><button className="btn btn-sm btn-outline-secondary" onClick={loadNotifications}>Refresh</button></div>{notifications.length===0?<p className="text-secondary mt-3">No order notifications yet. New orders from buyers will appear here.</p>:notifications.map(n=><div className="list-row" key={n._id}><div><b>{n.title}</b><small>{n.message} · {new Date(n.createdAt).toLocaleString()}</small></div><div className="d-flex gap-2 align-items-center"><span className={`status-pill ${n.read?'':'status-pending'}`}>{n.read?'Read':'New'}</span>{!n.read&&<button className="btn btn-sm btn-outline-secondary" onClick={()=>markRead(n._id)}>Mark read</button>}</div></div>)}</div>}
 <div className="dashboard-panel mb-4"><div className="d-flex justify-content-between align-items-center"><h3>{user.role==='buyer'?'Your orders':'Orders received'}</h3><button className="btn btn-sm btn-outline-secondary" onClick={loadOrders}>Refresh</button></div>{orders.length===0?<p className="text-secondary mt-3">{user.role==='buyer'?'You have not placed any orders yet. Browse the marketplace to order products.':'No buyer orders yet.'}</p>:orders.map(o=><div className="list-row" key={o._id}><div><b>{o.product?.title||'Product'}</b><small>{user.role==='buyer'?`Supplier: ${o.supplier?.company||o.supplier?.name||'Supplier'}`:`Buyer: ${o.buyer?.name||'Buyer'} (${o.buyer?.company||o.buyer?.email||''})`} · Qty: {o.quantity} · Total: {money(o.totalPrice,o.currency)}</small><small>Placed {new Date(o.createdAt).toLocaleString()}</small></div><div className="d-flex flex-column gap-2 align-items-end"><span className={`status-pill status-${o.status}`}>{o.status}</span>{['supplier','recycler','admin'].includes(user.role)&&o.status==='pending'&&<div className="d-flex gap-1"><button className="btn btn-sm btn-success" onClick={()=>updateOrder(o._id,'accepted')}>Accept</button><button className="btn btn-sm btn-outline-danger" onClick={()=>updateOrder(o._id,'rejected')}>Reject</button></div>}{['supplier','recycler','admin'].includes(user.role)&&o.status==='accepted'&&<button className="btn btn-sm btn-outline-primary" onClick={()=>updateOrder(o._id,'completed')}>Mark completed</button>}</div></div>)}</div>
 <div className="row g-4"><div className="col-lg-6"><div className="dashboard-panel"><div className="d-flex justify-content-between"><h3>Your product listings</h3><Link to="/products">Marketplace</Link></div>{products.length===0?<p className="text-secondary mt-3">No product listings yet. Supplier and recycler accounts can add listings from the marketplace page.</p>:products.map(p=><div className="list-row" key={p._id}><div><b>{p.title}</b><small>{p.lifecycle} · {money(p.price)}</small></div><span className={`status-pill status-${p.status}`}>{p.status}</span></div>)}</div></div><div className="col-lg-6"><div className="dashboard-panel"><div className="d-flex justify-content-between"><h3>{user.role==='buyer'?'Your requirements':'Open buyer requirements'}</h3><Link to="/requirements">View all</Link></div>{requirements.length===0?<p className="text-secondary mt-3">No requirements to show yet.</p>:requirements.slice(0,6).map(r=><div className="list-row" key={r._id}><div><b>{r.title}</b><small>{r.quantity.toLocaleString()} units · {r.deliveryLocation}</small></div><span className="status-pill">{r.status}</span></div>)}</div></div></div></>;
}
function Admin() {
 const {user}=useAuth();const [stats,setStats]=useState(null),[pending,setPending]=useState([]),[users,setUsers]=useState([]),[error,setError]=useState(''),[msg,setMsg]=useState('');
 const load=async()=>{try{const [s,p,u]=await Promise.all([api.get('/admin/stats'),api.get('/admin/pending-products'),api.get('/admin/users')]);setStats(s.data);setPending(p.data);setUsers(u.data);setError('')}catch(e){setError(e.response?.data?.message||'Admin access required.')}};
 useEffect(()=>{if(user?.role==='admin')load()},[user]);
 if(!user)return <NeedLogin/>;
 if(user.role!=='admin')return <Empty title="Administrator access required" text="This page is available only to the securely seeded admin account."/>;
 const moderate=async(id,status)=>{try{await api.patch(`/products/${id}/moderate`,{status});setMsg(`Product ${status}.`);load()}catch(e){setMsg(e.response?.data?.message||'Action failed.')}};
 const deactivate=async(u)=>{try{await api.patch(`/admin/users/${u._id}`,{isActive:!u.isActive});load()}catch(e){setMsg(e.response?.data?.message||'Action failed.')}};
 return <><PageHeader kicker="CONTROL CENTRE" title="Administrator dashboard" desc="Review listings and manage platform accounts."/><button className="btn btn-outline-secondary mb-3" onClick={load}><i className="bi bi-arrow-clockwise me-2"/>Refresh data</button>{error&&<ErrorMessage text={error}/ >}{stats&&<div className="row g-3 mb-4"><StatCard label="Registered users" value={stats.users}/><StatCard label="All products" value={stats.products}/><StatCard label="Pending listings" value={stats.pendingProducts}/><StatCard label="Buyer requirements" value={stats.requirements}/><StatCard label="Auctions" value={stats.auctions}/></div>}<p>{msg}</p><div className="dashboard-panel mb-4"><h3>Products awaiting approval <span className="status-pill">{pending.length} pending</span></h3>{pending.length===0?<p className="text-secondary mt-3">No pending products.</p>:pending.map(p=><div className="moderation-row" key={p._id}><div><b>{p.title}</b><small>{p.category} · {p.lifecycle} · {p.seller?.company||p.seller?.name} · {money(p.price)}</small><p className="small text-secondary mb-0">{p.description}</p></div><div className="d-flex gap-2"><button className="btn btn-sm btn-success" onClick={()=>moderate(p._id,'approved')}>Approve</button><button className="btn btn-sm btn-outline-danger" onClick={()=>moderate(p._id,'rejected')}>Reject</button></div></div>)}</div><div className="dashboard-panel"><h3>Registered accounts</h3><div className="table-responsive"><table className="table align-middle"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead><tbody>{users.map(u=><tr key={u._id}><td>{u.name}<small className="d-block text-secondary">{u.company}</small></td><td>{u.email}</td><td>{u.role}</td><td>{u.isActive?'Active':'Inactive'}</td><td>{u.role!=='admin'&&<button className="btn btn-sm btn-outline-secondary" onClick={()=>deactivate(u)}>{u.isActive?'Deactivate':'Activate'}</button>}</td></tr>)}</tbody></table></div></div></>;
}
function PageHeader({kicker,title,desc}){return <div className="page-header"><span className="eyebrow dark">{kicker}</span><h1>{title}</h1><p>{desc}</p></div>}
function Field({label,name,type='text',required=false,placeholder='',defaultValue}){return <div className="col-md-6"><label className="form-label">{label}</label><input className="form-control" name={name} type={type} required={required} placeholder={placeholder} defaultValue={defaultValue}/></div>}
function StatCard({label,value}){return <div className="col-6 col-lg"><div className="stat-card"><small>{label}</small><strong>{value}</strong></div></div>}
function Loading(){return <div className="loading-state"><div className="spinner-border text-success"/><p>Loading marketplace...</p></div>}
function ErrorMessage({text}){return <div className="alert alert-warning"><i className="bi bi-exclamation-triangle me-2"/>{text}</div>}
function Empty({title,text}){return <div className="empty-state"><i className="bi bi-inbox"/><h3>{title}</h3><p>{text}</p></div>}
function NeedLogin(){return <div className="empty-state"><i className="bi bi-person-lock"/><h3>Please log in first</h3><p>Sign in to access your business workspace.</p><Link to="/login" className="btn btn-teal">Log in</Link></div>}
function NotFound(){return <Empty title="Page not found" text="The page you're looking for doesn't exist."/>}
function Footer(){return <footer className="site-footer"><div className="container footer-main"><div><Link className="navbar-brand fw-bold" to="/"><span className="brand-icon"><i className="bi bi-recycle"/></span> ReMarket</Link><p>A smarter marketplace for electronics sourcing, reuse and recovery.</p></div><div><b>Marketplace</b><Link to="/products">All products</Link><Link to="/products/scrap">Electronic scrap</Link><Link to="/auctions">Auctions</Link></div><div><b>For businesses</b><Link to="/requirements">Bulk requirements</Link><Link to="/register">Join as a supplier</Link><Link to="/register">Create an account</Link></div></div><div className="container footer-bottom">© {new Date().getFullYear()} ReMarket. Business connections for a circular electronics economy.</div></footer>}
export default App;
