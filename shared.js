(function () {
  const categories = [
    { id: "dishes", label: "Khana-Khazana", accent: "#ff7a1a" },
    { id: "memories", label: "My Memories", accent: "#19d4ff" },
    { id: "natak", label: "Natak", accent: "#ffee32" },
    { id: "sargam", label: "Sargam", accent: "#ff3d9a" },
    { id: "photography", label: "Photography", accent: "#66ff7f" },
    { id: "unscripted", label: "Unscripted", accent: "#a78bfa" }
  ];

  const content = {
    profile: {
      owner: "Avi Narang",
      about: "Welcome to my little creative adda — a colorful corner filled with food, photographs, natak, sargam, and all those tiny memories that are too precious to be lost in the rush of life. By profession, I survive the corporate world, but my heart happily moonlights as a bhajan singer, an aspiring actor, a passionate home cook, and a full-time enthusiast of trying new things.This space is a reflection of everything I love — delicious food, photography, music, natak, and the beautiful chaos of collecting moments worth remembering. Some people collect stamps; I collect recipes, melodies, stories, and enough photos to keep my phone storage permanently stressed.
So, come along and enjoy the flavors, frames, spiritual melodies, and memories that make life wonderfully interesting.
After all, life is too short for boring meals and boring memories.
Hari Om Namah Shivaya !!!",
      youtube: "https://youtube.com/@kreativeadda?si=7Zf0meAXE-xwslH-",
      instagram: "https://www.instagram.com/kreativ.adda?igsh=aW5pZ3J6dWUxNHdt",
      email: "kreativeadda.avi@gmail.com",
      ownerPhoto: "assets/owner-photo.jpg"
    },
    music: {
      src: "assets/background-music.mp3",
      enabled: true
    },
    daily: {
      word: "Serenaded",
      meaning: "Surrounded by nature and gently enchanted by the beauty of the sunset.",
      thought: "Saturday is for slowing down, soaking in the moment, and finding joy in the simple things."
    },
    shop: {
      ownerPhone: "+91-9457171931",
      whatsappNumber: "91-9457171931",
      upiQr: "assets/upi-qr.png",
      orderSheetEndpoint: "",
      products: [
        {
          id: "sample-product",
          name: "Sample Product",
          image: "assets/product-1.jpg",
          images: ["assets/product-1.jpg", "assets/product-2.jpg", "assets/product-3.jpg", "assets/product-4.jpg"],
          about: "Replace this with your product details in shared.js.",
          price: 499,
          stock: 0,
          customizeAvailable: "Yes",
          codAvailable: "Yes",
          eta: "5-7 days"
        }
      ]
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
      category: "dishes",
        type: "image",
        title: "Dragon Pearl Bites",
        src: "assets/khana1.jpg",
        caption: "Delicately crafted with suji and poha, inspired by the bold flavors of Indian-Chinese cuisine."
        }
    ]
  };

  function categoryById(id) {
    return categories.find((category) => category.id === id) || categories[0];
  }

  window.KreativeAdda = { categories, content, categoryById };
})();
