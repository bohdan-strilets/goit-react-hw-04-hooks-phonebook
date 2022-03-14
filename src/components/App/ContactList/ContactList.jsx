import PropTypes from 'prop-types';
import Contact from '../Contact';
import css from './ContactList.module.css';

function ContactList({ contacts, onDeleteContact }) {
  return (
    <ul>
      {contacts.map(({ id, name, number }) => {
        return (
          <li className={css.item} key={id}>
            <Contact
              name={name}
              number={number}
              onDeleteContact={() => onDeleteContact(id)}
              contactId={id}
            />
          </li>
        );
      })}
    </ul>
  );
}

ContactList.prototype = {
  contacts: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    number: PropTypes.string.isRequired,
  }),
  onDeleteContact: PropTypes.func.isRequired,
};

export default ContactList;
