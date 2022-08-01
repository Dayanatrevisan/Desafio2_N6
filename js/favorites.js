import { GithubUser } from "./githubUser.js"


//classe que vai conter a visualizacao dos dados, como os dados serao estruturados
export class Favorites {
  constructor(root){
    this.root = document.querySelector(root)
    this.load()
  }

  load () {
    this.entries = JSON.parse(localStorage.getItem('@github-favotires:')) || []
  }

  save() {
    localStorage.setItem('@github-favotires:', JSON.stringify(this.entries))
  }

  async add(username) {
    try{

      const userExists = this.entries.find(entry => entry.login === username)
     
      if(userExists) {
        throw new Error ('Usuário já cadastrado.')
      }

      const user = await GithubUser.search(username)
      console.log(user)

      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    }catch(error){
      alert(error.message)
    }
  }

  delete(user) {
    this.entries = this.entries.filter(entry => entry.login !== user.login)
    
    this.update()
    this.save()
  }


  

}


// classe que vai  criar a visualizacao e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root){
    super(root)

    this.tbody = this.root.querySelector('table tbody') 

    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const {value} = this.root.querySelector('.search input')

      this.add(value)
    }

  }

 

  update(){
   this.removeAllTr()

    this.entries.forEach(user => {
    const row = this.createRow ()
    
    row.querySelector('.user img').src = `https://github.com/${user.login}.png`
    row.querySelector('.user img').alt = `Imagem de ${user.name}`
    row.querySelector('.user a').href = `https://github.com/${user.login}`
    row.querySelector('.user p').textContent =user.name
    row.querySelector('.user span').textContent = user.login
    row.querySelector('.repositories').textContent = user.public_repos
    row.querySelector('.followers').textContent = user.followers

    row.querySelector('.action').onclick = () => {
      const isOk = confirm('Tem certeza que deseja remover esse usuário?')
      if (isOk) {
        row.remove()
        this.delete(user)
      }
    }

    this.tbody.append(row)
   })  
  }


  createRow() {

    const tr = document.createElement('tr')
    tr.innerHTML =  `
    <td class="user">
      <img
        src="https://github.com/maykbrito.png"
        alt="Imagem de Mayk Brito"
      />
      <a href="https://github.com/maykbrito" target="_blank">
        <p>Mayk Brito</p>
        <span>/maykbrito</span>
      </a>
    </td>
    <td class="repositories">123</td>
    <td class="followers">1234</td>
    <td><button class="action"><p>Remover</p></button></td>
    `

    return tr
  }

  removeAllTr() {
    

    this.tbody.querySelectorAll('tr')//pegar todos os seletoles, todas as linhas
     .forEach((tr) => {  //para cada (tr) se executará esta funcao
      tr.remove()
    })
  }
}