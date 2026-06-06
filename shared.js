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
      about: "Welcome to my personal creative adda: a colorful space for food, photos, natak, sargam, photography and all the little memories that deserve a place of their own.",
      youtube: "#",
      instagram: "#",
      email: "",
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
    items: [
      { id: "sample-dishes", title: "Khana-Khazana", category: "dishes", type: "note", caption: "Upload dish photos to the GitHub repository and list them in shared.js." },
      { id: "sample-sargam", title: "Sargam", category: "sargam", type: "youtube", youtube: "", caption: "YouTube links can be embedded here so visitors watch from the website." }
    ]
  };

  function categoryById(id) {
    return categories.find((category) => category.id === id) || categories[0];
  }

  window.KreativeAdda = { categories, content, categoryById };
})();
