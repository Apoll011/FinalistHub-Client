import { Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import React, {useEffect, useState} from "react";
import { useAuth } from 'components/auth.tsx';
import { useMounted } from "hooks/useMounted";
import { Modal } from 'react-bootstrap';

const SignUp = () => {
  const hasMounted = useMounted();
  const navigate = useNavigate();
  const { register, login } = useAuth();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    if (username) {
      const generatedImage = getProfileImage(username);
      setProfileImage(generatedImage);
    }
  }, [username]);

  const handleUserInputChange = (e:  React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLFormElement>) => {
    const { value } = e.target as HTMLFormElement;
    setUsername(value);
  };

  const getProfileImage = (username: string) => {
    return `https://api.multiavatar.com/${username}.svg`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLFormElement>) => {
    const { name, value, checked } = e.target as HTMLFormElement;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'terms' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.terms) {
      setError('Please accept the Terms of Service and Privacy Policy');
      setLoading(false);
      return;
    }

    try {
      await register(formData.username, formData.password);
      await login(formData.username, formData.password);
      navigate('/');
    } catch {
      setError('Erro ao registrar. Tente outro nome de Usuario!');
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
                      className="w-100"
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
                      <div className="d-flex">
                      <Image src={profileImage} className="me-4" roundedCircle alt="User Avatar" width={50} height={50} />
                      <Form.Control
                          type="text"
                          name="username"
                          placeholder="Enter your username"
                          value={username}
                          onChange={(e) => {handleInputChange(e); handleUserInputChange(e);}}
                          required
                      />
                      </div>
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

                    <Form.Group className="mb-3" controlId="confirmPassword">
                      <Form.Label>Confirmar Password</Form.Label>
                      <Form.Control
                          type="password"
                          name="confirmPassword"
                          placeholder="**************"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                      />
                    </Form.Group>

                    <div className="mb-3">
                      <Form.Check type="checkbox" id="terms">
                        <Form.Check.Input
                            type="checkbox"
                            name="terms"
                            checked={formData.terms}
                            onChange={handleInputChange}
                        />
                        <Form.Check.Label>
                          Eu concordo com os <span style={{color: "blue", cursor: "pointer"}} onClick={handleShow}> Termos de Serviço </span>.
                        </Form.Check.Label>
                      </Form.Check>
                    </div>

                    <div>
                      <div className="d-grid">
                        <Button variant="primary" type="submit" disabled={loading}>
                          {loading ? "Criando..." : "Criar Conta"}
                        </Button>
                      </div>
                      <div className="d-md-flex justify-content-between mt-4">
                        <div className="md-0">
                          <Link to="/auth/sign-in" className="fs-5">
                            Já é um membro? Login{" "}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Form>
              )}
            </Card.Body>
          </Card>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Termos de Serviço - FinalistHub</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Última Atualização: 23/12/2024</p>
              <ol>
                <li>
                  <strong>Aceitação dos Termos de Serviço</strong>
                  <p>
                    Ao acessar ou utilizar o FinalistHub, você concorda em cumprir com
                    estes Termos de Serviço ("Termos"). Se você não concorda com qualquer
                    parte destes Termos, não deve acessar ou usar o site.
                  </p>
                </li>
                <li>
                  <strong>Uso do Site</strong>
                  <p>
                    O FinalistHub foi desenvolvido exclusivamente por Tiago Bernardo para uso
                    interno da Comissão de Finalistas da EICM-GDC. O acesso ao site é restrito
                    a membros da comissão e destina-se exclusivamente à gestão de eventos, venda
                    de bilhetes, registros de itens e reuniões, além da visualização de dados
                    financeiros.
                  </p>
                  <ul>
                    <li><strong>Permissão de Uso:</strong> O acesso é restrito aos membros da Comissão de Finalistas e deve ser usado apenas para os fins mencionados.</li>
                    <li><strong>Responsabilidade pelo Uso:</strong> O usuário é responsável por todas as atividades realizadas em sua conta, e o uso do site é pessoal e intransferível.</li>
                    <li><strong>Conformidade:</strong> O uso do FinalistHub deve estar em conformidade com todas as leis e regulamentos aplicáveis.</li>
                  </ul>
                </li>
                <li>
                  <strong>Propriedade Intelectual</strong>
                  <p>
                    Todo o conteúdo, design, código-fonte e funcionalidades do FinalistHub
                    são de propriedade exclusiva de Tiago Bernardo, que desenvolveu o site
                    para a Comissão de Finalistas da EICM-GDC.
                  </p>
                  <ul>
                    <li><strong>Direitos de Propriedade:</strong> O conteúdo do site, incluindo design e código-fonte, são protegidos por direitos autorais.</li>
                    <li><strong>Restrições de Uso:</strong> O usuário não pode copiar, distribuir, modificar ou explorar comercialmente qualquer parte do site sem autorização prévia.</li>
                  </ul>
                </li>
                <li>
                  <strong>Responsabilidade e Isenção de Responsabilidade</strong>
                  <p>
                    O uso do FinalistHub é por sua conta e risco. O site é fornecido "no estado em que se encontra" e não há garantias sobre seu funcionamento.
                  </p>
                  <ul>
                    <li><strong>Uso por Sua Conta e Risco:</strong> O site pode conter erros e falhas, e Tiago Bernardo e a Comissão de Finalistas não garantem sua disponibilidade contínua.</li>
                    <li><strong>Isenção de Garantias:</strong> Não há garantias expressas ou implícitas, incluindo as relacionadas a comercialização ou adequação a um propósito específico.</li>
                    <li><strong>Limitação de Responsabilidade:</strong> Tiago Bernardo e a Comissão de Finalistas não se responsabilizam por danos incidentais ou consequentes relacionados ao uso do site.</li>
                  </ul>
                </li>
                <li>
                  <strong>Privacidade</strong>
                  <p>
                    O uso do FinalistHub está sujeito à nossa Política de Privacidade, que descreve como suas informações são coletadas, usadas e protegidas.
                  </p>
                  <ul>
                    <li><strong>Coleta de Informações:</strong> O site não coleta dados pessoais.</li>
                  </ul>
                </li>
                <li>
                  <strong>Modificações dos Termos de Serviço</strong>
                  <p>
                    Tiago Bernardo e a Comissão de Finalistas reservam-se o direito de modificar os Termos de Serviço a qualquer momento. Alterações serão notificadas e entrarão em vigor após publicação.
                  </p>
                  <ul>
                    <li><strong>Alterações:</strong> Alterações podem ocorrer a qualquer momento, e será sua responsabilidade revisar os Termos.</li>
                    <li><strong>Responsabilidade do Usuário:</strong> O usuário deve verificar periodicamente os Termos para estar ciente de quaisquer mudanças.</li>
                  </ul>
                </li>
                <li>
                  <strong>Encerramento de Acesso</strong>
                  <p>
                    A Comissão de Finalistas pode suspender ou encerrar o acesso ao site em caso de violação destes Termos ou outras condutas impróprias.
                  </p>
                  <ul>
                    <li><strong>Suspensão ou Rescisão:</strong> O acesso ao FinalistHub pode ser suspenso se houver violação dos Termos.</li>
                    <li><strong>Direitos dos Usuários:</strong> O usuário pode solicitar o encerramento de sua conta entrando em contato com o suporte.</li>
                  </ul>
                </li>
                <li>
                  <strong>Geral</strong>
                  <ul>
                    <li><strong>Jurisdicação e Legislação Aplicável:</strong> Estes Termos são regidos pelas leis de Cabo Verde e quaisquer disputas serão resolvidas no foro competente.</li>
                    <li><strong>Divisibilidade:</strong> Se alguma cláusula for considerada inválida, as demais permanecerão válidas.</li>
                    <li><strong>Contatos e Suporte:</strong> Para dúvidas, entre em contato através de tiagobernrdo@gmail.com.</li>
                  </ul>
                </li>
              </ol>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Fechar
              </Button>
            </Modal.Footer>
          </Modal>

        </Col>
      </Row>
  );
};

export default SignUp;