export const dormImageMap = {
  1: {
    main: '/Amplayo/amplayomain.png',
    gallery: [
      '/Amplayo/amplayo.png',
      '/Amplayo/amplayo1.jpg',
      '/Amplayo/amplayo2.png',
      '/Amplayo/amplayo3.png',
    ],
  },
  2: {
    main: '/BlueHeaven/bluemain.png',
    gallery: ['/BlueHeaven/blue.jpg', '/BlueHeaven/blue1.jpg', '/BlueHeaven/blue2.jpg'],
  },
  3: {
    main: '/Blissful/blissfulmain.png',
    gallery: ['/Blissful/blissful.jpg', '/Blissful/blissful1.jpg', '/Blissful/blissful2.jpg'],
  },
  4: {
    main: '/Licayan/licayanmain.png',
    gallery: [
      '/Licayan/licayan.png',
      '/Licayan/licayan1.png',
      '/Licayan/licayan2.jpg',
      '/Licayan/licayan3.jpg',
    ],
  },
  5: {
    main: '/Chelsea/chelseamain.jpg',
    gallery: [
      '/Chelsea/chelsea.jpg',
      '/Chelsea/chelsea1.jpg',
      '/Chelsea/chelsea2.jpg',
      '/Chelsea/chelsea3.jpg',
    ],
  },
  6: {
    main: '/TGBG/tgbgmain.png',
    gallery: ['/TGBG/tgbg.png', '/TGBG/tgbg1.png', '/TGBG/tgbg2.png', '/TGBG/tgbg3.png'],
  },
  7: {
    main: '/Magdura/magduramain.png',
    gallery: [
      '/Magdura/magdura.png',
      '/Magdura/magdura1.png',
      '/Magdura/magdura2.png',
      '/Magdur3.png',
    ],
  },
  8: {
    main: '/Karmo/karmomain.jpg',
    gallery: ['/Karmo/karmo.jpg', '/Karmo/karmo1.jpg', '/Karmo/karmo2.jpg'],
  },
  9: {
    main: '/Banton/bantonmain.png',
    gallery: [
      '/Banton/banton.jpg',
      '/Banton/banton1.jpg',
      '/Banton/banton2.jpg',
      '/Banton/banton3.jpg',
    ],
  },
  10: {
    main: '/Collegefacade/collegemain.jpg',
    gallery: [
      '/Collegefacade/college.jpg',
      '/Collegefacade/college1.jpg',
      '/Collegefacade/college2.jpg',
      '/Collegefacade/college3.jpg',
    ],
  },
  11: {
    main: '/JP/jpmain.jpg',
    gallery: ['/JP/jp.jpg', '/JP/jp1.jpg', '/JP/jp2.jpg', '/JP/jp3.jpg'],
  },
  12: {
    main: '/Lagrange/lagmain.jpg',
    gallery: [
      '/Lagrange/lag.jpg',
      '/Lagrange/lag1.jpg',
      '/Lagrange/lag2.jpg',
      '/Lagrange/lag3.jpg',
    ],
  },
  13: {
    main: '/MDs/mdmain.jpg',
    gallery: ['/MDs/md.jpg', '/MDs/md1.jpg', '/MDs/md2.jpg', '/MDs/md3.jpg'],
  },
  14: {
    main: '/Justin/justinmain.jpg',
    gallery: [
      '/Justin/justin.jpg',
      '/Justin/justin1.jpg',
      '/Justin/justin2.jpg',
      '/Justin/justin3.jpg',
    ],
  },
  15: {
    main: '/Camella/camella.jpg',
    gallery: [
      '/Camella/camella.jpg',
      '/Camella/camella1.jpg',
      '/Camella/camella2.jpg',
      '/Camella/camella3.jpg',
    ],
  },
  16: {
    main: '/Cryshiels/crymain.jpg',
    gallery: [
      '/Cryshiels/cry.jpg',
      '/Cryshiels/cry1.jpg',
      '/Cryshiels/cry2.jpg',
      '/Cryshiels/cry3.jpg',
    ],
  },
  17: {
    main: '/Manor/manormain.jpg',
    gallery: ['/Manor/manor2.jpg', '/Manor/manor.jpg', '/Manor/manor1.jpg', '/Manor/manor3.jpg'],
  },
}

// Helper functions for image management
export const getMainImage = (dormId) => {
  if (dormImageMap[dormId]) {
    return dormImageMap[dormId].main
  }
  return '/default-dorm-image.jpg'
}

export const getGalleryImages = (dormId) => {
  if (dormImageMap[dormId]) {
    return dormImageMap[dormId].gallery
  }
  return ['/default-dorm-image.jpg']
}

export const hasDormImages = (dormId) => {
  return !!dormImageMap[dormId]
}
