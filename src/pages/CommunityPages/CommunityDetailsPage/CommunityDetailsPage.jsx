import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Col, Container, Row, Button, Dropdown, Modal } from "react-bootstrap"
import { AuthContext } from "../../../contexts/auth.context"

import Loader from "../../../components/Loader/Loader"
import MoviesList from "../../../components/MovieComponentes/MoviesList/MoviesList"
import UserCard from "../../../components/User/UserCard/UserCard"
import PersonsList from "../../../components/PersonComponents/PersonsList/PersonsList"
import EditCommunityForm from "../../../components/CommunitiesComponents/Forms/EditCommunityForm/EditCommunityForm"

import communityServices from "../../../services/community.services"

import "./CommunityDetailsPage.css"
import userServices from "../../../services/user.services"

const CommunityDetailsPage = () => {

    const { loggedUser } = useContext(AuthContext)

    const [community, setCommunity] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)

    const [showEditModal, setShowEditModal] = useState(false)

    const { communityId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadCommunityDetails()
    }, [])

    const loadCommunityDetails = () => {
        communityServices
            .fetchOneCommunityFullData(communityId)
            .then(response => {
                const { data: community } = response
                setCommunity(community)
                setIsLoading(false)
            })
            .catch(err => console.log(err))
    }

    const handleCommunityDelete = () => {
        communityServices
            .deleteCommunity(communityId)
            .then(() => navigate('/comunidades'))
            .catch(err => console.log(err))
    }

    const handleFollowCommunity = () => {

        communityServices
            .followCommunity(community._id, loggedUser._id)
            .then(() => loadCommunityDetails())
            .catch(err => console.log())
    }

    const { _id, title, description, cover, genres, fetishActors, fetishDirectors, decades, moviesApiIds, users, owner, createdAt, updatedAt } = community

    return (

        isLoading ? <Loader /> :

            <div className="CommunityDetailsPage">
                <Container>
                    <Row>
                        <Col className="position-relative" style={{ height: "20rem" }}>
                            <img className="w-100 h-100 object-fit-cover rounded opacity-50" src={cover} alt="Cover" />
                            <div className="ps-5 community-title-container position-absolute top-50 translate-middle-y">
                                <h1 className="fw-bold m-0 pt-4">{title} ({moviesApiIds?.length})</h1>
                                {
                                    genres.map(genre => {
                                        return (
                                            <span key={genre} className="me-2 fw-bold opacity-50">{genre}</span>
                                        )
                                    })
                                }
                                <p className="fs-5 mt-0" >{description}</p>
                                {
                                    loggedUser?._id !== owner._id ?
                                        <Button className="border-0 fw-bold btn-style-2" onClick={handleFollowCommunity}>
                                            Unirse a la comunidad
                                        </Button>
                                        :
                                        users.includes(loggedUser._id) ?
                                            <Button className="border-0 fw-bold btn-style-2" >
                                                Dejar de seguir
                                            </Button>
                                            :
                                            <Dropdown className="m-0 d-flex align-items-center">
                                                <Dropdown.Toggle className="btn-style-2 border-0 fw-bold" id="dropdown-basic">
                                                    Administrar
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu className="boder-0 m-0">
                                                    <Dropdown.Item className="ps-5 pe-5 pt-2 text-white" as="button" onClick={() => setShowEditModal(true)}>Editar comunidad</Dropdown.Item>
                                                    <Dropdown.Item className="ps-5 pe-5 pt-2 text-white" as="button" onClick={() => setShowModal(true)}>Eliminar comunidad</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col>
                            <Row>
                                <p className="m-0 fw-bold">Administrador</p>
                            </Row>
                            <Row className="mt-2">
                                <Col>
                                    <UserCard {...owner} />
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <p className="m-0 fw-bold">Décadas</p>
                                </Col>
                            </Row>
                            <Row className="mt-2">
                                <Col>
                                    {
                                        decades.map(decade => {
                                            return (
                                                <span key={decade} className="me-2 opacity-50">{decade} </span>
                                            )
                                        })
                                    }
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <p className="m-0 fw-bold ">Actores fetiche de la comunidad</p>
                                </Col>
                            </Row>
                            <Row className="mt-2">
                                <Col>
                                    {
                                        fetishActors?.length ?
                                            <PersonsList persons={fetishActors} />
                                            :
                                            <Row>
                                                <Col >
                                                    Todavía no hay actores fetiche en esta comunidad
                                                </Col>
                                            </Row>
                                    }
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <p className="m-0 fw-bold ">Directores fetiche de la comunidad</p>
                                </Col>
                            </Row>
                            <Row className="mt-2" >
                                <Col>
                                    {
                                        fetishDirectors?.length ?
                                            <PersonsList persons={fetishDirectors} />
                                            :
                                            <Row>
                                                <Col >
                                                    Todavía no hay actores fetiche en esta comunidad
                                                </Col>
                                            </Row>
                                    }
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col md={{ span: 9 }}>
                            <Row>
                                <Col>
                                    <p className="m-0 fw-bold fs-5">Películas recomendadas por la comunidad</p>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col>
                                    {
                                        !moviesApiIds?.length ?
                                            <Row>
                                                <Col >
                                                    Todavía no hay ninguna película recomendada en esta comunidad
                                                </Col>
                                            </Row>
                                            :
                                            <MoviesList movies={moviesApiIds} />
                                    }
                                </Col>
                            </Row>
                        </Col>
                        <Col className="mt-4 ps-lg-4 ps-md-0" md={{ span: 3 }}>
                            <Row className="mt-3">
                                <Col>
                                    <p className="fw-bold fs-6">Usuarios de la comunidad ({users.length})</p>
                                    <hr className="p2" />
                                </Col>
                            </Row>
                            {
                                users?.length ?
                                    <Row>
                                        {
                                            users.map(elm => {
                                                return (
                                                    <Col className="mb-2" lg={{ span: 12 }} key={elm._id}>
                                                        <UserCard {...elm} />
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Row>

                                    :

                                    <Row>
                                        <Col  >
                                            Ningún usuario sigue esta comunidad
                                        </Col>
                                    </Row>

                            }
                        </Col>
                    </Row>

                    <Modal
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        backdrop="static"
                        keyboard={false}
                        centered
                    >
                        <Modal.Header className="border-0 ps-4" closeButton>
                            <Modal.Title>Eliminar comunidad</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="pe-4 ps-4">
                            Si continúas no se podrá recuperar la comunidad. ¿Estás seguro de que quieres continuar?
                        </Modal.Body>
                        <Modal.Footer className="border-0">
                            <Button variant="danger" onClick={() => handleCommunityDelete()}>
                                Eliminar definitivamente
                            </Button>
                            <Button variant="dark" onClick={() => setShowModal(false)}>Cancelar</Button>
                        </Modal.Footer>
                    </Modal >

                    <Modal
                        show={showEditModal}
                        onHide={() => setShowEditModal(false)}
                        backdrop={true}
                        keyboard={true}
                        size="xl"
                    >
                        <Modal.Header className="ps-4" closeButton>
                            <Modal.Title>Editar comunidad</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="pe-4 ps-4">
                            <EditCommunityForm community={community} setShowEditModal={setShowEditModal} loadCommunityDetails={loadCommunityDetails} />
                        </Modal.Body>
                    </Modal >

                </Container >
            </div >
    )
}

export default CommunityDetailsPage