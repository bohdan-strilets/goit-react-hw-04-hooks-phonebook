import { Component } from 'react';
import { nanoid } from 'nanoid';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { BsFillPersonPlusFill } from 'react-icons/bs';
import ContactForm from './ContactForm';
import ContactList from './ContactList';
import Filter from './Filter';
import Message from './Message';
import Modal from './Modal';
import css from './App.module.css';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
    showModal: false,
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);

    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const nextContacts = this.state.contacts;
    const prevContacts = prevState.contacts;

    if (nextContacts !== prevContacts) {
      localStorage.setItem('contacts', JSON.stringify(nextContacts));
    }

    if (
      nextContacts.length > prevContacts.length &&
      prevContacts.length !== 0
    ) {
      this.toggleModal();
    }
  }

  addContact = ({ name, number }) => {
    const { contacts } = this.state;
    const newContact = { id: nanoid(), name, number };

    contacts.some(contact => contact.name === name)
      ? Report.warning(
          `${name}`,
          'This user is already in the contact list.',
          'OK',
        )
      : this.setState(({ contacts }) => ({
          contacts: [newContact, ...contacts],
        }));
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  changeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };

  filtredContacts = () => {
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(({ name }) =>
      name.toLowerCase().includes(normalizedFilter),
    );
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  render() {
    const { filter, showModal } = this.state;
    const addContact = this.addContact;
    const changeFilter = this.changeFilter;
    const filtredContacts = this.filtredContacts();
    const deleteContact = this.deleteContact;
    const length = this.state.contacts.length;
    const toggleModal = this.toggleModal;

    return (
      <div className={css.container}>
        <h1 className={css.title}>
          Phone<span className={css.title__color}>book</span>
        </h1>
        <button className={css.button} type="button" onClick={toggleModal}>
          <span className={css.button__text}>Add new contact</span>{' '}
          <BsFillPersonPlusFill size={20} />
        </button>
        {showModal && (
          <Modal onClose={toggleModal} title="Add contact">
            <ContactForm onSubmit={addContact} />
          </Modal>
        )}

        <h2 className={css.subtitle}>Contacts</h2>
        <Filter filter={filter} changeFilter={changeFilter} />

        {length > 0 ? (
          <ContactList
            contacts={filtredContacts}
            onDeleteContact={deleteContact}
          />
        ) : (
          <Message text="Contact list is empty." />
        )}
      </div>
    );
  }
}

export default App;
