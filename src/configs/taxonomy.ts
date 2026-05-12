export type CategoryNode = {
  name: string
  children?: CategoryNode[]
}

export const taxonomy: CategoryNode[] = [
  {
    name: "Кухня",
    children: [
      {
        name: "Посуд",
        children: [
          { name: "Каструлі" },
          { name: "Сковорідки" },
          { name: "Чайники" },
          { name: "Тарілки та миски" }
        ]
      },
      {
        name: "Аксесуари",
        children: [
          { name: "Розпилювачі" },
          { name: "Преси" },
          { name: "Таймери" }
        ]
      }
    ]
  },
  {
    name: "Кондитерка",
    children: [
      {
        name: "Інгредієнти",
        children: [
          { name: "Спеції" },
          { name: "Дріжджі" },
          { name: "Цукор" },
          { name: "Сиропи" }
        ]
      },
      {
        name: "Інвентар",
        children: [
          { name: "Форми" },
          { name: "Шприци" }
        ]
      }
    ]
  }
]