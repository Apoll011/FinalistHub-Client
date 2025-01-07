import React, { useState } from 'react';
import {useAuth} from 'hooks/useAuth.ts';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import ShowIfAdmin from "components/auth/admin/show_if_admin.tsx";
import {useProfilePicture} from "hooks/useProfilePicture.ts";
import useGetUsers from "hooks/useGetUsers.ts";

const ProfileManagement: React.FC = () => {
    const { user, changeUserRole, changePassword, deleteUser } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const { users, loadUsers } = useGetUsers(setError);
    
    const profileImage = useProfilePicture(user?.username || "");
    
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await changePassword(newPassword);
            setSuccess('Senha alterada com sucesso');
            setNewPassword('');
        } catch {
            setError('Falha ao alterar a senha');
        }
    };

    const handleChangeRole = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser || !selectedRole) return;

        try {
            await changeUserRole(selectedUser, selectedRole);
            setSuccess(`Função atualizada para ${selectedUser}`);
            await loadUsers();
        } catch (error) {
            setError('Falha ao alterar a função do usuário: ' + error);
        }
    };

    const handleDeleteUser = async (username: string) => {
        if (window.confirm(`Tem certeza de que deseja excluir o usuário ${username}?`)) {
            try {
                await deleteUser(username);
                setSuccess(`Usuário ${username} excluído com sucesso`);
                await loadUsers();
            } catch {
                setError('Falha ao excluir o usuário');
            }
        }
    };
    
    const getProfileImage = (username: string) => {
        return `https://api.multiavatar.com/${username.toLowerCase()}.svg`;
    };

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col xs={12} md={10} lg={8}>
                    {user && (
                        <Card className="mb-4">
                            <Card.Header>
                                <Card.Title>Informações do Perfil</Card.Title>
                            </Card.Header>
                            <Card.Body className="d-flex align-items-center">
                                <img
                                    src={profileImage}
                                    alt="Foto de Perfil"
                                    className="rounded-circle me-3"
                                    width="100"
                                    height="100"
                                />
                                <div>
                                    <h2>{user.username}</h2>
                                    <p>Função: {user.username !== "apoll011" ? user.role : "God of IT"}</p>
                                </div>
                            </Card.Body>
                        </Card>
                    )}

                    <Card>
                        <Card.Header>
                            <Card.Title>Gestão de Perfil</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            {error && (
                                <Alert variant="danger" onClose={() => setError('')} dismissible>
                                    {error}
                                </Alert>
                            )}
                            {success && (
                                <Alert variant="success" onClose={() => setSuccess('')} dismissible>
                                    {success}
                                </Alert>
                            )}

                            <Form onSubmit={handleChangePassword} className="mb-4">
                                <h3 className="h5 mb-3">Alterar Senha</h3>
                                <Row className="align-items-end">
                                    <Col xs={12} sm={8}>
                                        <Form.Group>
                                            <Form.Control
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Nova Senha"
                                                name="new_password"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={4} className="mt-2 mt-sm-0">
                                        <Button type="submit" variant="primary" className="w-100">
                                            Alterar Senha
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                            
                            {user && (
                                <Row className="align-items-end">
                                    <Col xs={12} sm={8}>
                                        <h3 className="h5 mb-3">Apagar Conta</h3>
                                    </Col>
                                    <Col xs={12} sm={4} className="mt-2 mt-sm-0">
                                        <Button
                                            variant="danger"
                                            className="w-100"
                                            onClick={() => handleDeleteUser(user.username)}
                                        >
                                            Apagar Conta
                                        </Button>
                                    </Col>
                                </Row>
                            )}

                            <ShowIfAdmin>
                                <div className="mt-4">
                                    <h3 className="h5 mb-3">Gestão de Usuários</h3>

                                    <Form onSubmit={handleChangeRole} className="mb-4">
                                        <Row className="align-items-end g-2">
                                            <Col xs={12} sm={4}>
                                                <Form.Group>
                                                    <Form.Select
                                                        value={selectedUser}
                                                        onChange={(e) => setSelectedUser(e.target.value)}
                                                    >
                                                        <option value="">Selecionar Usuário</option>
                                                        {users.map((user) => (
                                                            <option key={user.id} value={user.username}>
                                                                {user.username}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col xs={12} sm={4}>
                                                <Form.Group>
                                                    <Form.Select
                                                        value={selectedRole}
                                                        onChange={(e) => setSelectedRole(e.target.value)}
                                                    >
                                                        <option value="">Selecionar Função</option>
                                                        <option value="admin">Admin</option>
                                                        <option value="member">Membro</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col xs={12} sm={4}>
                                                <Button type="submit" variant="primary" className="w-100">
                                                    Atualizar Função
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>

                                    <h4 className="h6 mb-3">Lista de Usuários</h4>
                                    <ListGroup>
                                        {users.map((u) => (
                                            <ListGroup.Item
                                                key={u.id}
                                                className="d-flex justify-content-between align-items-center"
                                            >
                                                <div>
                                                    <img
                                                        src={getProfileImage(u.username)}
                                                        alt="Foto de Perfil"
                                                        className="rounded-circle me-3"
                                                        width="30"
                                                        height="30"
                                                    />
                                                    <span className="fw-medium">{u.username}</span>
                                                    <span className="ms-2 text-muted">({u.username !== "apoll011" ? u.role : "It's none of your business"})</span>
                                                </div>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    disabled={u.username === "apoll011"}
                                                    onClick={() => handleDeleteUser(u.username)}
                                                >
                                                    {u.username !== "apoll011" ? "Excluir" : "No No No No"}
                                                </Button>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </div>
                            </ShowIfAdmin>
                        </Card.Body>
                    </Card>
                    
                    
                </Col>
            </Row>
        </Container>
    );
};

export default ProfileManagement;
