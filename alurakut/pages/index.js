import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSideBar(props){
  return(
    <Box>
      <img src={`https://github.com/${props.gitHubUser}.png`} style={{borderRadius: '8px'}} />

      <hr />

      <a className="boxLink" href={`https://github.com/${props.gitHubUser}`}>
        @{props.gitHubUser}
      </a>

      <hr />

      <AlurakutProfileSidebarMenuDefault />

    </Box>
  );
}

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">{props.title} ({props.items.length})</h2>
      <ul>
        {props.items.slice(0, 6).map((itemAtual) => {
          return (
            <li key = {itemAtual.login}>
              <a href={`https://github.com/${itemAtual.login}`}>
                <img src={`https://github.com/${itemAtual.login}.png`} />
                <span>{itemAtual.login}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home(props) {
  const githubUser = props.githubUser;
  const [comunidades, setComunidades] = React.useState([]);
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ];

  const [seguidores, setSeguidores] = React.useState([]);
  
  React.useEffect(() => {
    fetch(`https://api.github.com/users/${githubUser}/followers`)
    .then((respostaDoServidor) => {
      return respostaDoServidor.json();
    })
    .then((respostaCompleta) => {
      setSeguidores(respostaCompleta);
    })

    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': 'd74d01e7f5e2d25e27c172f9f62d75',
        'Content-Type': 'application/json', 
        'Accept': 'application/json',
      }, 
      body: JSON.stringify({"query": `query {
        allCommunities{
          title
          id
          imageUrl
          creatorslug
        }
      }` })
      })
      .then((response) => response.json())
      .then((respostaCompleta) => {
        const comunidadesVidasDoDato = respostaCompleta.data.allCommunities;
        setComunidades(comunidadesVidasDoDato);
    });
  }, [])

  return (
    <>
      <AlurakutMenu githubUser = {githubUser}/>
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar gitHubUser={ githubUser }/>
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Bem vindo</h1>
            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle ">O que você deseja fazer?</h2>
            <form onSubmit={(e)=>{
              e.preventDefault();
              
              const dadosForm = new FormData(e.target);

              const comunidade = {
                title: dadosForm.get('title'),
                imageUrl: dadosForm.get('image'),
                creatorslug: githubUser,
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(comunidade)
              })
              .then(async (response) => {
                  const dados = await response.json();
                  console.log(dados)
                  const comunidade = dados.registroCriado;

                  const comunidadesAtt = [...comunidades, comunidade];
                  setComunidades(comunidadesAtt);
              })

              const newComunidades = [...comunidades, comunidade]
              setComunidades(newComunidades)
            }}>
              <div>
                <input 
                  placeholder="Qual vai ser o nome da sua comunidade?" 
                  name="title" 
                  aria-label="Qual vai ser o nome da sua comunidade?" 
                  type="text"
                />
              </div>

              <div>
                <input 
                  placeholder="Coloque uma URL para usarmos de capa." 
                  name="image" 
                  aria-label="Coloque uma URL para usarmos de capa." 
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>

          </Box>
        </div>

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>

          <ProfileRelationsBox title="Seguidores" items={ seguidores } />

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Profissionais de Referência ({pessoasFavoritas.length})</h2>
            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key = {itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Comunidades ({comunidades.length})</h2>
            <ul>
              {comunidades.slice(0, 6).map((itemAtual) => {
                return (
                  <li key = {itemAtual.id}>
                    <a href={`https://github.com/${itemAtual.creatorslug}`} target="_blank" >
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li> 
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const token = cookies.USER_TOKEN;

  if(token === "undefined"){
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }else{
    const { login } = jwt.decode(token);

    return {
      props: {
        githubUser: login
      }, 
    };
  }

  
}
