import { gql } from "@apollo/client";

export const LOAD_CONTACT = gql`
    query GetPhoneList(
        $where: phone_bool_exp, 
        $limit: Int,
        $offset: Int,
        $distinct_on: [phone_select_column!], 
        $order_by: [phone_order_by!]
    ) {
    phone(where: $where, distinct_on: $distinct_on, order_by: $order_by, limit: $limit, 
        offset: $offset) {
            contact {
                last_name
                first_name
                id
            }
                number
        }
    }
`

export const SEARCH = gql`
        query GetContactList(
            $distinct_on: [contact_select_column!]
            $limit: Int
            $offset: Int
            $order_by: [contact_order_by!]
            $where: contact_bool_exp
        ) {
            contact(
                distinct_on: $distinct_on
                limit: $limit
                offset: $offset
                order_by: $order_by
                where: $where
            ) {
                created_at
                first_name
                id
                last_name
                phones {
                    number
                }
            }
        }
    `;