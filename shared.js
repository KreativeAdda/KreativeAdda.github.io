(function () {
  const categories = [
    { id: "dishes", label: "Dishes", accent: "#ff7a1a" },
    { id: "memories", label: "My Memories", accent: "#19d4ff" },
    { id: "natak", label: "Natak", accent: "#ffee32" },
    { id: "sargam", label: "Sargam", accent: "#ff3d9a" },
    { id: "photography", label: "Photography", accent: "#66ff7f" },
    { id: "unscripted", label: "Unscripted", accent: "#a78bfa" },
    { id: "contact", label: "Contact", accent: "#ffffff", isContact: true }
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
    daily: {
      word: "Kreative",
      meaning: "To shape everyday moments into memories, music and art.",
      thought: "Every day has one small spark worth saving."
    },
    items: [
      { id: "sample-dishes", title: "Dishes", category: "dishes", type: "note", caption: "Upload dish photos to the GitHub repository and list them in shared.js." },
      { id: "sample-sargam", title: "Sargam", category: "sargam", type: "youtube", youtube: "", caption: "YouTube links can be embedded here so visitors watch from the website." }
    ]
  };

  function categoryById(id) {
    return categories.find((category) => category.id === id) || categories[0];
  }

  window.KreativeAdda = { categories, content, categoryById };
})();
