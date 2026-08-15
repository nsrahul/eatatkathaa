"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type MenuSection = { name: string; note: string; items: string[] };

const menu: MenuSection[] = [
  { name: "Hot Drinks", note: "Freshly brewed & warming", items: ["Tea", "Coffee", "Bru coffee", "Horlicks", "Boost", "Milk", "Black coffee", "Black tea", "Lime tea"] },
  { name: "Soups", note: "A warm beginning", items: ["Clear soup — chicken or veg", "Sweet corn soup — chicken or veg", "Hot & sour soup — chicken or veg", "Manchow soup — chicken or veg", "Mushroom soup"] },
  { name: "Breakfast", note: "A slow Kerala morning", items: ["Idli set", "Appam", "Idiyappam", "Plain dosa", "Masala dosa", "Puttu", "Cake roast", "Porotta", "Poori masala", "Bread omelette"] },
  { name: "Veg Curries", note: "Kerala comfort, without compromise", items: ["Veg kuruma", "Paneer butter masala", "Green peas curry", "Kadala curry", "Potato masala"] },
  { name: "Egg", note: "Any time is egg time", items: ["Egg curry", "Omelette", "Bullseye", "Egg burji", "Egg roast"] },
  { name: "Chicken", note: "Homestyle curries & hearty roasts", items: ["Kerala chicken curry", "Chicken varutharachathu", "Butter chicken", "Chettinad chicken curry", "Chicken roast", "Chicken kadai", "Chicken kuruma", "Chicken tandoori"] },
  { name: "Fish", note: "The coast on a plate", items: ["Kerala fish curry", "Fish fry", "Fish mulakittathu", "Fish moilee", "Fish pollichathu", "Kanthari thava fish", "Fish peera"] },
  { name: "Prawns", note: "Coastal, rich & full of flavour", items: ["Prawns masala", "Prawns roast", "Prawns curry", "Prawns fry", "Travancore prawns curry"] },
  { name: "Beef & Non-Veg Curries", note: "Deep, slow-cooked Kerala flavours", items: ["Beef roast", "Beef fry", "Beef curry", "Beef chilli"] },
  { name: "Rice & Biryani", note: "Big plates, bigger appetite", items: ["Veg meals", "Non-veg meals", "Veg biryani", "Egg biryani", "Prawns biryani", "Fish biryani", "Chicken biryani"] },
  { name: "Chinese", note: "Wok-tossed favourites", items: ["Gobi manchurian", "Schezwan mushroom", "Chilli mushroom", "Paneer manchurian", "Chilli gobi", "Pepper chicken", "Chilli chicken", "Chicken 65", "Garlic chicken", "Ginger chicken", "Chicken manchurian", "Veg fried rice", "Egg fried rice", "Chicken fried rice", "Mixed fried rice", "Beef fried rice", "Prawns fried rice", "Veg noodles", "Egg noodles", "Chicken noodles", "Mixed noodles", "Prawns noodles"] },
  { name: "Mandi & Shawaya", note: "Fire, smoke & generous platters", items: ["Kuzhi mandi", "Alfaham", "Peri-peri alfaham", "BBQ alfaham", "Kanthari alfaham", "Honey chilli alfaham", "Pepper alfaham", "Kondattam alfaham", "Masala shawaya"] },
  { name: "Shawarma", note: "Rolled fresh, made our way", items: ["Katha special shawarma", "Mexican shawarma", "Classic shawarma", "Cheese burst shawarma", "Lebanese shawarma"] },
  { name: "Juices", note: "Fresh, bright & chilled", items: ["Fresh lime", "Pure apple", "Watermelon", "Orange", "Apple", "Muskmelon", "Grape"] },
  { name: "Mojitos", note: "Coolers with a little sparkle", items: ["Mango mojito", "Strawberry mojito", "Blue curacao mojito", "Green apple mojito", "Mint lemon mojito", "Watermelon mojito", "Classic virgin mojito"] },
  { name: "Shakes", note: "Thick, cold & indulgent", items: ["Oreo shake", "Butterscotch shake", "Biscoff shake", "Mango shake", "Sharjah shake", "Choco brownie bomb", "Avocado shake", "Katha special falooda", "Palein shake", "Royal falooda", "Pista shake", "Tender coconut", "Dates shake", "Vanilla shake", "Strawberry shake"] },
  { name: "Desserts", note: "Save room for the ending", items: ["Belgian dark chocolate brownie sundae", "Chocolate vanilla fudge sundae", "Death by chocolate", "Chocolate vanilla waffle", "Chocolate pyramid"] },
];

const highlights = [
  { no: "01", title: "Beef Roast", line: "Dark, slow-roasted and unapologetically Kerala.", tag: "HOUSE MOOD" },
  { no: "02", title: "Katha Special Shawarma", line: "A familiar wrap, told our way.", tag: "KATHA ORIGINAL" },
  { no: "03", title: "Coastal Fish Curry", line: "Coconut, chilli and the pull of the coast.", tag: "FROM HOME" },
];

function Arrow({ className = "" }: { className?: string }) {
  return <span className={`uiArrow ${className}`} aria-hidden="true" />;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const visibleMenu = useMemo(() => {
    const base = activeCategory === "All" ? menu : menu.filter((section) => section.name === activeCategory);
    if (!query.trim()) return base;
    const needle = query.toLowerCase();
    return base.map((section) => ({ ...section, items: section.items.filter((item) => item.toLowerCase().includes(needle)) })).filter((section) => section.items.length);
  }, [activeCategory, query]);

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState("sending");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    const whatsappMessage = [
      "Hi Katha, I'd like to request a table.",
      "",
      `Name: ${payload.name}`,
      `Phone: ${payload.phone}`,
      `Date: ${payload.date}`,
      `Guests: ${payload.guests}`,
      payload.note ? `Note: ${payload.note}` : "",
      "",
      "Please confirm if the table is available. Thank you!",
    ].filter(Boolean).join("\n");
    try {
      const response = await fetch("/api/reservations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error("Could not send");
      form.reset();
      setFormState("sent");
      window.location.href = `https://wa.me/919188870927?text=${encodeURIComponent(whatsappMessage)}`;
    } catch {
      setFormState("error");
    }
  }

  return (
    <main>
      <nav className="nav" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Katha home"><img src="/katha-logo.svg" alt="Katha" /></a>
        <div className="navLinks">
          <a href="#story">Our story</a><a href="#menu">Menu</a><a href="#visit">Visit</a>
        </div>
        <button className="navButton" onClick={() => setMenuOpen(true)}>Explore menu <Arrow /></button>
      </nav>

      <section className="hero" id="top">
        <div className="heroImage" aria-hidden="true" />
        <div className="heroShade" />
        <div className="heroCopy reveal">
          <p className="eyebrow">KERALA AT HEART · OPEN TO THE WORLD</p>
          <h1>Every plate<br />has a <em>story.</em></h1>
          <p className="heroText">From the curries we grew up with to the cravings we picked up along the way—Katha brings them all to one generous table.</p>
          <div className="heroActions"><button className="pill light" onClick={() => setMenuOpen(true)}>Discover the menu <Arrow /></button><a href="#story" className="textLink">Meet Katha <span>↓</span></a></div>
        </div>
        <div className="heroStamp" aria-hidden="true"><span>EST.</span><b>കഥ</b><span>KERALA</span></div>
        <div className="scrollHint">SCROLL TO TASTE <span>↓</span></div>
      </section>

      <section className="marquee" aria-label="Katha values"><div>KERALITE SOUL <i>✦</i> GLOBAL CRAVINGS <i>✦</i> GOOD FOOD, GOOD STORIES <i>✦</i> KERALITE SOUL <i>✦</i> GLOBAL CRAVINGS <i>✦</i></div></section>

      <section className="story section" id="story">
        <div className="storyIntro"><p className="kicker">CHAPTER ONE · OUR KATHA</p><h2>A restaurant built around the food we keep coming back to.</h2></div>
        <div className="storyBody"><p>Katha means <em>story</em>. Ours begins with Kerala kitchens: the scent of curry leaves hitting hot coconut oil, porotta torn by hand, and curries that ask you to stay for one more spoonful.</p><p>But a good story keeps moving. So our table makes room for smoky alfaham, lively shawarma, biryani, noodles, shakes and all the dishes that became part of how Kerala eats today.</p><a className="underLink" href="#menu">READ OUR MENU <Arrow /></a></div>
        <div className="spiceOrbit" aria-hidden="true"><div className="orbit orbit1"><span>✦</span></div><div className="orbit orbit2"><span>●</span></div><div className="spiceCore"><b>കഥ</b><small>MADE WITH<br />A LITTLE SOUL</small></div></div>
      </section>

      <section className="highlights section">
        <div className="sectionHead"><div><p className="kicker">THE KATHA EDIT</p><h2>Come hungry.<br /><em>Leave with a favourite.</em></h2></div><p>Three plates that tell you where we come from—and where we’re going.</p></div>
        <div className="highlightGrid">
          {highlights.map((item, index) => <article className="foodCard" key={item.title} style={{ "--delay": `${index * 80}ms` } as React.CSSProperties}>
            <div className={`foodVisual food${index + 1}`}><span className="cardNo">{item.no}</span><span className="cardTag">{item.tag}</span><div className="dishIcon">{index === 0 ? "✺" : index === 1 ? "◒" : "≈"}</div></div>
            <h3>{item.title}</h3><p>{item.line}</p>
          </article>)}
        </div>
      </section>

      <section className="menuPreview section" id="menu">
        <div className="menuTitle"><p className="kicker">THE WHOLE TABLE</p><h2>One menu.<br /><em>Many moods.</em></h2><button className="circleButton" onClick={() => setMenuOpen(true)} aria-label="Open full menu"><Arrow /></button></div>
        <div className="menuStrips">
          {menu.slice(0, 5).map((section, index) => <button key={section.name} onClick={() => { setActiveCategory(section.name); setMenuOpen(true); }}><span>0{index + 1}</span><b>{section.name}</b><small>{section.note}</small><i><Arrow /></i></button>)}
        </div>
      </section>

      <section className="quoteSection"><blockquote>“Food tastes better<br />when there’s a story<br /><em>at the table.</em>”</blockquote><div className="leaf leaf1">❧</div><div className="leaf leaf2">❧</div></section>

      <section className="visit section" id="visit">
        <div><p className="kicker">COME, PULL UP A CHAIR</p><h2>Your next Katha<br />starts <em>here.</em></h2><p className="visitCopy">Planning a meal with us? Send a request and our team will confirm the table with you.</p><div className="contactLinks"><a className="contactLink whatsapp" href="https://wa.me/919188870927?text=Hi%20Katha%2C%20I%27d%20like%20to%20share%20my%20review%20with%20you." target="_blank" rel="noreferrer"><span className="contactIcon">✦</span><span><small>TELL US YOUR REVIEW ON WHATSAPP</small><b>+91 91888 70927</b></span><i><Arrow /></i></a><a className="contactLink" href="mailto:eatatkatha@gmail.com"><span className="contactIcon">@</span><span><small>WRITE TO KATHA</small><b>eatatkatha@gmail.com</b></span><i><Arrow /></i></a></div><a className="insta" href="https://www.instagram.com/eat_at_katha/?hl=en" target="_blank" rel="noreferrer">FOLLOW @EAT_AT_KATHA <Arrow /></a></div>
        <form className="booking" onSubmit={submitBooking}>
          <label>Your name<input name="name" required placeholder="Name" /></label>
          <label>Phone number<input name="phone" required inputMode="tel" placeholder="+91" /></label>
          <div className="formRow"><label>Date<input name="date" required type="date" /></label><label>Guests<select name="guests" defaultValue="2"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6+</option></select></label></div>
          <label>Anything we should know?<textarea name="note" placeholder="Birthday, high chair, favourite corner…" /></label>
          <button className="pill dark" disabled={formState === "sending"}>{formState === "sending" ? "Sending…" : "Request a table"}<Arrow /></button>
          {formState === "sent" && <p className="formMessage success">Your request is saved. WhatsApp is opening—please send the prepared message to Katha for confirmation.</p>}
          {formState === "error" && <p className="formMessage">That didn’t go through. Please try again or message us on Instagram.</p>}
        </form>
      </section>

      <footer><img src="/katha-logo.svg" alt="Katha" /><p>KERALA AT HEART · OPEN TO THE WORLD</p><div><a href="#story">Story</a><a href="#menu">Menu</a><a href="#visit">Visit</a><a href="https://wa.me/919188870927?text=Hi%20Katha%2C%20I%27d%20like%20to%20share%20my%20review%20with%20you." target="_blank" rel="noreferrer">WhatsApp <Arrow /></a><a href="mailto:eatatkatha@gmail.com">Email <Arrow /></a><a href="https://www.instagram.com/eat_at_katha/?hl=en" target="_blank" rel="noreferrer">Instagram <Arrow /></a></div><small>© {new Date().getFullYear()} Katha. Made for good food and longer conversations.</small></footer>

      <div className={`menuDrawer ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <button className="menuBackdrop" onClick={() => setMenuOpen(false)} aria-label="Close menu" />
        <div className="menuPanel" role="dialog" aria-modal="true" aria-label="Katha menu">
          <div className="drawerHead"><div><p className="kicker">THE KATHA MENU</p><h2>Find your<br /><em>next favourite.</em></h2></div><button className="closeButton" onClick={() => setMenuOpen(false)} aria-label="Close menu">×</button></div>
          <div className="searchBar"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search biryani, curry, shake…" aria-label="Search menu" /></div>
          <div className="categoryTabs"><button className={activeCategory === "All" ? "active" : ""} onClick={() => setActiveCategory("All")}>All</button>{menu.map((section) => <button key={section.name} className={activeCategory === section.name ? "active" : ""} onClick={() => setActiveCategory(section.name)}>{section.name}</button>)}</div>
          <div className="drawerMenu">{visibleMenu.length ? visibleMenu.map((section) => <section key={section.name}><div><h3>{section.name}</h3><p>{section.note}</p></div><ul>{section.items.map((item) => <li key={item}><span>{item}</span><i>Price coming soon</i></li>)}</ul></section>) : <p className="emptyMenu">No dish found yet. Try another craving.</p>}</div>
          <div className="drawerNote">Menu names are editable and prices can be added when you’re ready.</div>
        </div>
      </div>
    </main>
  );
}
