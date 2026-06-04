(function () {
  const categories = [
    { id: "dishes", label: "Dishes Photos", accent: "#ff7a1a" },
    { id: "my-pics", label: "My Pics", accent: "#19d4ff" },
    { id: "acting", label: "Acting Videos", accent: "#ffee32" },
    { id: "bhajan-songs", label: "Bhajan & Song Videos", accent: "#ff3d9a" },
    { id: "photography", label: "Photography Items", accent: "#66ff7f" },
    { id: "misc", label: "Miscellaneous Stuff", accent: "#a78bfa" }
  ];

  const defaultState = {
    profile: {
      owner: "Avi Narang",
      about:
        "Welcome to my personal creative adda: a colorful space for food, photos, acting, devotional music, songs, photography and all the little memories that deserve a place of their own.",
      youtube: "#",
      instagram: "#"
    },
    items: [
      {
        id: "sample-dishes",
        title: "Add Your Dishes Photos",
        category: "dishes",
        type: "placeholder",
        caption: "Upload food photos from the admin dashboard and they will appear in this category."
      },
      {
        id: "sample-acting",
        title: "Add Acting Videos",
        category: "acting",
        type: "placeholder",
        caption: "Stage clips, auditions, expressions and scenes can live here."
      },
      {
        id: "sample-bhajan",
        title: "Add Bhajan & Song Videos",
        category: "bhajan-songs",
        type: "placeholder",
        caption: "Share devotional moments, singing videos and musical memories."
      }
    ]
  };

  const storageKey = "kreativeAddaContent";

  function loadState() {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return structuredClone(defaultState);
      const parsed = JSON.parse(saved);
      return {
        profile: { ...defaultState.profile, ...(parsed.profile || {}) },
        items: Array.isArray(parsed.items) ? parsed.items : defaultState.items
      };
    } catch (error) {
      return structuredClone(defaultState);
    }
  }

  function saveState(state) {
    localStorage.setItem(storageKey, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("kreative:adda-updated"));
  }

  function categoryById(id) {
    return categories.find((category) => category.id === id) || categories[categories.length - 1];
  }

  window.KreativeAdda = {
    categories,
    defaultState,
    loadState,
    saveState,
    categoryById,
    storageKey
  };
})();
