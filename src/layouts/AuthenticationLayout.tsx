//import node module libraries
import { Outlet } from "react-router";
import { Container } from "react-bootstrap";

const AuthenticationLayout = () => {
  return (
    <section className="fixed inset-0 w-100 h-full bg-light"
             style={{
                 backgroundImage: `url(/images/bg.jpg)`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
                 position: 'fixed',
                 zIndex: -1
             }}>
      <Container className="relative min-h-screen w-full d-grid">
        <Outlet />
      </Container>
    </section>
  );
};

export default AuthenticationLayout;
