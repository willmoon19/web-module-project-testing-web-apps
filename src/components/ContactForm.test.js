import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';
import App from "../App"

test('renders without errors', ()=>{
    render(<ContactForm />);
});

test('renders the contact form header', ()=> {
    render(<ContactForm />);
    const header = screen.queryByText(/Contact Form/i);
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
    const firstName = screen.getByLabelText(/first name/i);
    userEvent.type(firstName, "will")
    expect(firstName).toBeInTheDocument()
    const errorMessage = await screen.findByText(/must have at least 5 characters/i)
    expect(errorMessage).toBeInTheDocument();

});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>);

    const firstNameInput = screen.getByLabelText(/first name/i);
    expect(firstNameInput).toHaveValue("");

    const messageInput = screen.getByLabelText(/message/i);
    expect(messageInput).toHaveValue("");

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveValue("");

    const button = screen.getByRole(/button/i);
    userEvent.click(button);
    
    const errorMessages = screen.queryAllByText(/error:/i);
	expect(errorMessages).toHaveLength(3);

});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>);

    const firstNameInput = screen.getByLabelText(/first name/i);
    userEvent.type(firstNameInput, "William");
    expect(firstNameInput).toHaveValue("William");

    const lastNameInput = screen.getByLabelText(/last name/i);
    userEvent.type(lastNameInput, "William");
    expect(lastNameInput).toHaveValue("William");

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveValue("");

    const button = screen.getByRole(/button/i);
    userEvent.click(button);
    
    const errorMessages = screen.queryAllByText(/error:/i);
	expect(errorMessages).toHaveLength(1);

});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>);

    const emailInput = screen.getByLabelText(/email/i);
    userEvent.type(emailInput, "wwww");
    expect(emailInput).toHaveValue("wwww");

    const button = screen.getByRole(/button/i);
    userEvent.click(button);

    const emailError = await screen.findByText(/email must be a valid email address/i)
    expect(emailError).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>);

    const lastNameInput = screen.getByLabelText(/last name/i);
    userEvent.type(lastNameInput, "");
    expect(lastNameInput).toHaveValue("");

    const button = screen.getByRole(/button/i);
    userEvent.click(button);

    const lastError = await screen.findByText(/is a required field/i)
    expect(lastError).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>);

    const firstSelect = "William"
    const lastSelect = "Williams"
    const emailSelect = "wmoon@yahoo.com"

    const firstNameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameInput, "William");
    expect(firstNameInput).toHaveValue("William");

    const messageInput = screen.getByLabelText(/message/i);
    expect(messageInput).toHaveValue("");

    const lastInput = screen.getByLabelText(/last name*/i);
    userEvent.type(lastInput, "Williams");
    expect(lastInput).toHaveValue("Williams");

    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, "wmoon@yahoo.com");
    expect(emailInput).toHaveValue("wmoon@yahoo.com");

    const messageDiv = screen.queryByText(/you submitted/i);
	expect(messageDiv).toBeFalsy();

    const button = screen.getByRole(/button/i);
    userEvent.click(button);
    
    const firstName = await screen.findByText(firstSelect)
    expect(firstName).toBeInTheDocument();
    
    const lastName = await screen.findByText(lastSelect)
    expect(lastName).toBeInTheDocument();

    const emailStuff = await screen.findByText(emailSelect)
    expect(emailStuff).toBeInTheDocument();

    const messageTest = await screen.queryByTestId(/messageDisplay/i);
    expect(messageTest).not.toBeInTheDocument()
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>);

    const firstSelect = "William"
    const lastSelect = "Williams"
    const emailSelect = "wmoon@yahoo.com"
    // const messageSelect = "Hello William"

    const firstNameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameInput, "William");
    expect(firstNameInput).toHaveValue("William");

    const messageInput = screen.getByLabelText(/message/i);
    userEvent.type(messageInput, "Hello William")
    expect(messageInput).toHaveValue("Hello William");

    const lastInput = screen.getByLabelText(/last name*/i);
    userEvent.type(lastInput, "Williams");
    expect(lastInput).toHaveValue("Williams");

    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, "wmoon@yahoo.com");
    expect(emailInput).toHaveValue("wmoon@yahoo.com");

    const messageDiv = screen.queryByText(/you submitted/i);
	expect(messageDiv).toBeFalsy();

    const button = screen.getByRole(/button/i);
    userEvent.click(button);
    
    const firstName = await screen.findByText(firstSelect)
    expect(firstName).toBeInTheDocument();
    
    const lastName = await screen.findByText(lastSelect)
    expect(lastName).toBeInTheDocument();

    const emailStuff = await screen.findByText(emailSelect)
    expect(emailStuff).toBeInTheDocument();

    const messageTest = await screen.findByText(/Message:/i);
    expect(messageTest).toBeInTheDocument();



});