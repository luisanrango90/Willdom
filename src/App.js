import { isEmpty, map, size } from 'lodash'
import React, { useEffect, useState } from 'react'
import shortid from 'shortid'
import axios from 'axios';
import './style.css';
function App()
{
  const urlApiWatches = "https://gnews.io/api/v4/search?q=watches&token=00e716b9555a74a2e35c62a8571391f9"
  const urlApiNetCore = "https://reactserviceapp.azurewebsites.net/api/Articulos"
  const [data, setData] = useState([])
  const [dataNet, setDataNet] = useState([])
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [publicacion, setPublicacion] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [id, setId] = useState("")
  const [error, setError] = useState(null)
  const [imagen, setImagen] = useState();

  const ValidarFormulario = () =>
  {
    let isValidado = true
    setError(null)

    if (isEmpty(titulo))
    {
      setError("Debe ingresar un título")
      isValidado = false
    }
    if (isEmpty(descripcion))
    {
      setError("Debe ingresar una descripción")
      isValidado = false
    }
    return isValidado
  }

  const AgregarPublicacionTask = (e) =>
  {
    e.preventDefault()
    if (!ValidarFormulario())
    {
      return
    }
    const newpubli = {
      id: shortid.generate(),
      title: titulo,
      descripcion: descripcion,
      logo: imagen
    }
    setPublicacion([...publicacion, newpubli])
    setTitulo("")
    setDescripcion("")
  }
  const borrarPublicacion = (id) =>
  {
    const tareasfiltradas = publicacion.filter(tarea => tarea.id !== id)
    setPublicacion(tareasfiltradas)
  }
  const editarPublicacion = (lapublic) =>
  {
    setTitulo(lapublic.title)
    setDescripcion(lapublic.descripcion)
    setEditMode(true)
    setId(lapublic.id)

  }
  const guardarPublicacion = (e) =>
  {
    e.preventDefault()
    if (!ValidarFormulario())
    {
      return
    }
    const editPublic = publicacion.map(item => item.id === id ? { id, title: titulo, descripcion: descripcion, logo: imagen } : item)
    setPublicacion(editPublic)
    setEditMode(false)
    setId("")
    setTitulo("")
    setDescripcion("")
  }
  const cambiarImagen = e =>
  {
    setImagen(e.target.files[0]);
    console.log(imagen);
    const fileReader = new FileReader();
  }
  const servicioReloj = async () =>
  {
    await axios.get(urlApiWatches)
      .then(response =>
      {
        setData(response.data.articles);
      }).catch(error =>
      {
        console.log(error);
      });
  }
  const servicioCore = async () =>
  {
    await axios.get(urlApiNetCore)
      .then(response =>
      {
        setDataNet(response.data);
      }).catch(error =>
      {
        console.log(error);
      });
  }

  useEffect(() =>
  {
    servicioReloj();
    servicioCore();
  }, [])
  return (

    <div className="container mt-5">
      <section >
        <nav className="navbar-static-top">
          <ul>
            <li><a href="#locales">Local</a></li>
            <li><a href="#remotas">Remotas</a></li>
            <li><a href="#plus">Plus</a></li>
          </ul>
        </nav>
      </section>

      <div id="locales">
        <h1>Publicaciones Locales</h1>
        <hr />
        <div className="row">
          <div className="row row-cols-1 row-cols-md-2 g-4 pb-4">
            {
              size(publicacion) === 0 ? (
                <h5>No existen publicaciones</h5>
              ) :
                publicacion.map((publi) => (
                  <div className="col">
                    <div className="card">
                      <h5 className="card-header">{publi.title}</h5>
                      <div className="card-body">
                        <img className="img-fluid" src={publi.image} height="150px" margin="auto"></img>
                        <p className="card-text">{publi.descripcion}</p>
                        <button className="btn btn-outline-secondary btn-block " onClick={() => editarPublicacion(publi)}>Editar</button> {"   "}
                        <button className="btn btn btn-outline-danger btn-block " onClick={() => borrarPublicacion(publi.id)}  >Eliminar</button>
                      </div>
                    </div>
                  </div>
                ))
            }

          </div>
          <div className="col-12">
            <h4 className="text-center">
              {editMode ? "Modificar articulo" : "Agregar publicación"}
            </h4>
            <form onSubmit={editMode ? guardarPublicacion : AgregarPublicacionTask}>
              {error && <span className="text-danger mb-2">{error}</span>}
              <input type="text"
                className="form-control mb-2"
                placeholder="Titulo"
                onChange={(text) => setTitulo(text.target.value)}
                value={titulo}
                id="titulo"
              />
              <textarea className="form-control" type="text"
                className="form-control mb-2"
                placeholder="Descripción"
                onChange={(text) => setDescripcion(text.target.value)}
                value={descripcion}
              />
              <input className="form-control" type="file" name="imagen" onChange={cambiarImagen} />
              <br />
              <button className={editMode ? "btn btn-warning btn-block" : "btn btn-success btn-block"} type="submit"
              >{editMode ? "Modificar" : "Agregar"}</button>
            </form>
          </div>
        </div>
      </div>
      {/* Las publicaciones remotas */}
      <div id="remotas">
        <h1>Publicaciones Remotas</h1>
        <hr />
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {
            size(data) === 0 ? (
              <h5>No existen publicaciones Remotas</h5>
            ) :
              data.map((publi) => (
                <div className="col">
                  <div className="card">
                    <h5 className="card-header">{publi.title}</h5>
                    <div className="card-body">
                      <img className="img-fluid" src={publi.image} height="150px" margin="auto"></img>
                      <p className="card-text">{publi.description}</p>
                      <p className="card-text">{publi.content}</p>
                    </div>
                  </div>
                </div>
              ))
          }
        </div>
      </div>
      {/* Las publicaciones remotas */}
      <div id="plus">
        <h1>Publicaciones Remotas +</h1>
        <hr />
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {
            size(dataNet) === 0 ? (
              <h5>No existen publicaciones Remotas +</h5>
            ) : dataNet.map((publi) => (
              <div className="col">
                <div className="card">
                  <h5 className="card-header">{publi.title}</h5>
                  <div className="card-body">
                    <img className="img-fluid" src={publi.url} height="150px" margin="auto"></img>
                    <p className="card-text">{publi.description}</p>
                    <p className="card-text">{publi.content}</p>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default App;