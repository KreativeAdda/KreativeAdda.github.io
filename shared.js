(function () {
  const categories = [
    { id: "dishes", label: "Khana-Khazana", description: "Food, dishes, recipes, and tasty kitchen memories.", badge: "Khana-Khazana", accent: "#ff7a1a" },
    { id: "memories", label: "My Memories", description: "Personal pictures and moments worth keeping.", badge: "My Memories", accent: "#19d4ff" },
    { id: "natak", label: "Natak", description: "Acting videos, performances, reels, and stage moments.", badge: "Natak", accent: "#ffee32" },
    { id: "sargam", label: "Sargam", description: "Bhajan, songs, music, and devotional videos.", badge: "Sargam", accent: "#ff3d9a" },
    { id: "photography", label: "Photography", description: "Frames, clicks, nature, travel, and visual experiments.", badge: "Photography", accent: "#66ff7f" },
    { id: "unscripted", label: "Unscripted", description: "Everything creative that does not fit one fixed box.", badge: "Unscripted", accent: "#a78bfa" }
  ];

  const content = {
    profile: {
      owner: "Avi Narang",
      about: "Welcome to my little Kreativ.Adda — a colorful corner filled with food, photographs, natak, sargam, and all those tiny memories that are too precious to be lost in the rush of life. By profession, I survive the corporate world, but my heart happily moonlights as a bhajan singer, an aspiring actor, a passionate home cook, and a full-time enthusiast of trying new things. This space is a reflection of everything I love — delicious food, photography, music, natak, and the beautiful chaos of collecting moments worth remembering. So, come along and enjoy the flavors, frames, spiritual melodies, and memories that make life wonderfully interesting. Hari Om Namah Shivaya.",
      youtube: "https://youtube.com/@kreativeadda?si=7Zf0meAXE-xwslH-",
      instagram: "https://www.instagram.com/kreativ.adda?igsh=aW5pZ3J6dWUxNHdt",
      email: "Kreativadda.avi@gmail.com",
      ownerPhoto: "assets/owner-photo.jpg"
    },
    music: {
      src: "assets/background-music.mp3",
      enabled: true
    },
    daily: {
      word: "Serenaded",
      meaning: "Surrounded by nature and gently enchanted by the beauty of the sunset.",
      thought: "Every day is a second chance to do better."
    },
    shop: {
      ownerPhone: "+91-9457171931",
      whatsappNumber: "919457171931",
      upiQr: "assets/upi-qr.png",
      products: []
    },
    items: [
      {
        category: "photography",
        type: "image",
        title: "Golden Horizon",
        src: "assets/photo1.jpg",
        caption: "Framed by nature, serenaded by the sunset."
      },
      {
        category: "photography",
        type: "image",
        title: "Nature's Tiny Masterpiece",
        src: "assets/photo2.jpg",
        caption: "Held in my hand, crafted by nature — proof that even the smallest leaves can steal the spotlight."
      },
      {
        category: "dishes",
        type: "image",
        title: "Dragon Pearl Bites",
        src: "assets/khana1.jpg",
        caption: "Delicately crafted with suji and poha, inspired by the bold flavors of Indian-Chinese cuisine."
      },
      {
        category: "natak",
        type: "youtube",
        title: "Monologue Act - Terrorist",
        url: "https://youtu.be/AjQ0EeaCIk0?si=uVGJQdPPlHyOtmAh",
        caption: "Kasab Monologue Act performed in Anupam Kher's Actor Prepares."
      }
    ]
  };

  function categoryById(id) {
    return categories.find((category) => category.id === id) || categories[0];
  }

  function getCategoryItems(categoryId) {
    return (content.items || [])
      .filter((item) => item.category === categoryId)
      .map((item) => ({ ...item, url: item.url || item.youtube || "" }));
  }

  function youtubeEmbedUrl(url) {
    const raw = String(url || "").trim();
    if (!raw) return "";
    const shortMatch = raw.match(/youtu\.be\/([^?&]+)/);
    const watchMatch = raw.match(/[?&]v=([^?&]+)/);
    const embedMatch = raw.match(/embed\/([^?&]+)/);
    const id = shortMatch?.[1] || watchMatch?.[1] || embedMatch?.[1] || raw;
    return `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
  }

  function applyShopStatus() {
    return;
  }

  window.KreativeAddaContent = content;
  window.KreativeAdda = { categories, content, categoryById, getCategoryItems, youtubeEmbedUrl, applyShopStatus };
})();
