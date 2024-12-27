import {Row, Col, Card, Form, Button, Image, Spinner} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from 'hooks/useAuth';
import { useMounted } from "hooks/useMounted";

const SignIn = () => {
  const hasMounted = useMounted();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLFormElement>) => {
    const { name, value, checked } = e.target as HTMLFormElement;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'remember' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.username, formData.password);
      navigate('/');
    } catch {
      setError('Usuário ou password incorretos.');
      setLoading(false);
    }
  };

  return (
      <Row className="align-items-center justify-content-center g-0 min-vh-100">
        <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
          <Card className="smooth-shadow-md">
            <Card.Body className="p-6">
              <div className="mb-4">
                  <Image
                      src="/images/logo.png"
                      className="mb-2 w-100"
                      alt=""
                  />
              </div>

              {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
              )}

              {hasMounted && (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="username">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                          type="text"
                          name="username"
                          placeholder="Seu usuario"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                          type="password"
                          name="password"
                          placeholder="**************"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                      />
                    </Form.Group>

                    <div>
                      <div className="d-grid">
                        <Button variant="primary" type="submit" disabled={loading}>
                          {loading ? <Spinner animation="border" size="sm" /> : "Entrar"}
                        </Button>
                      </div>
                      <div className="d-md-flex justify-content-between mt-4">
                        <div className="mb-2 mb-md-0">
                          <Link to="/auth/sign-up" className="fs-5">
                            Criar uma conta{" "}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
  );
};

export default SignIn;