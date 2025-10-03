import { Link } from 'react-router';

function NotFound() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <p>This Page Not Found</p>
      <Link to="/">Go back Home</Link>
    </div>
  );
}
export default NotFound;
