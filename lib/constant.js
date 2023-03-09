export const ProductHelpers = {
  PRODUCT_TITLE: "No Product Title",
  PRODUCT_DESCRIPTION: "No Product Description",
};

export const menuItems = {
  id: '1',
  name: "Vertex Documents",
  link: "/docs",
  public: true,
  children: [],
};

function filterPublicRoute(items, isPublic) {
  return items.filter(item => item.public === isPublic).map(item => {
    item = Object.assign({}, item)
    if (item.children) {
      item.children = filterPublicRoute(item.children, isPublic)
    }
    return item
  })
}

export function getMenuItems (isPublic) {
  if(isPublic) {
    menuItems.children = filterPublicRoute(menuItems.children, isPublic);
    return menuItems;
  } else {
    return menuItems;
  }
}

export const wikiPage = {
  block_id: '8ef7f4611e4a4b769812167833aa83bd',
  path: '/wiki',
  baseManu: {
    id: '8ef7f4611e4a4b769812167833aa83bd',
    name: "📙 Wiki",
    link: "/wiki",
    public: true,
    children: []
  }
}

export const appDocs = {
  block_id: '51e15122d8894a7e8cfa91488957649a',
  path: '/docs',
  baseManu: {
    id: '51e15122d8894a7e8cfa91488957649a',
    name: "📗 Vertex Documents",
    link: "/docs",
    public: true,
    children: []
  }
}

export const state_while_reval = 60 * 60 * 24 * 30; // 30 day

export const maxage = 10; // 10 Second

