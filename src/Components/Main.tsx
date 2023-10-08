/** @jsxImportSource @emotion/react */
import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { LOAD_CONTACT, SEARCH } from "../Graphql/Queries";
import { ADD_CONTACT, DELETE_CONTACT } from "../Graphql/Mutatios";
import { css } from "@emotion/react";
import LoadScreen from "./LoadScreen";
import AddButton from "./AddButton";
import ModalContainer from "./ModalContainer";

interface ContactProps {
    contact: {
        id?: number | null;
        first_name?: string;
        last_name?: string;
    };
    number?: number | null;
}

interface AddContactBioProps {
    first_name?: string;
    last_name?: string;
}
interface AddContactNumberProps {
    number: string;
}

const Main = () => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [showModal, setShowModal] = React.useState<string>("none");

    const [contactList, setContactList] = React.useState<Array<ContactProps>>([]);
    const [favoriteContactList, setFavoriteContactList] = React.useState<Array<ContactProps>>([]);
    const [regularContactList, setRegularContactList] = React.useState<Array<ContactProps>>([]);
    const [searchContactList, setSearchContactList] = React.useState([]);
    const [searchContact, setSearchContact] = React.useState<String>("");
    const [addContact, setAddContact] = React.useState<AddContactBioProps>({
        first_name: "",
        last_name: "",
    });
    const [addContactNumber, setAddContactNumber] = React.useState<Array<AddContactNumberProps>>(
        []
    );
    const [pages, setPages] = React.useState<string>("1");

    const pageList = ["1", "2", "3", "all"];

    const handleSearchTextVariable = React.useMemo(() => {
        let str;
        const isSpace = searchContact.includes(" ");

        if (isSpace) {
            let split = searchContact.split(" ");
            if (split[0].length > 0) {
                str = `%${split[0]}%`;
            } else {
                str = "";
            }
        } else {
            if (searchContact.length > 0) {
                str = `%${searchContact}%`;
            } else {
                str = "";
            }
        }
        const variableSearch = {
            where: {
                first_name: { _like: str },
            },
        };

        return variableSearch;
    }, [searchContact]);

    const handlePaginationVariable = React.useMemo(() => {
        let offsetAmt;

        if (pages === "1" || pages === "") {
            offsetAmt = 0;
        } else {
            let index = pageList.findIndex((item: any) => item == pages);
            offsetAmt = index * 10;
        }

        const variablePage = {
            limit: 10,
            offset: offsetAmt,
        };
        return pages === "all" ? {} : variablePage;
    }, [pages]);

    const dataList = useQuery(LOAD_CONTACT, { variables: handlePaginationVariable });
    const searchList = useQuery(SEARCH, { variables: handleSearchTextVariable });
    const [deleteContact, {}] = useMutation(DELETE_CONTACT);
    const [submitContact, { error }] = useMutation(ADD_CONTACT);

    React.useEffect(() => {
        if (dataList.data?.phone) {
            localStorage.setItem("list", JSON.stringify(dataList.data?.phone));
        }

        if (favoriteContactList.length > 0) {
            const arrFil = dataList.data?.phone.filter((item: any) => {
                return item != favoriteContactList;
            });
            setRegularContactList(arrFil);
        }

        const data = localStorage.getItem("list");
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return data != undefined ? setContactList(JSON.parse(data)) : setContactList([]);

        // eslint-disable-next-line
    }, [dataList, isLoading]);

    React.useEffect(() => {
        if (searchList.data?.contact) {
            setSearchContactList(searchList.data?.contact);
        }
    }, [searchList]);

    const handlePickedContact = (id: string, number: string, entity: string) => {
        if (entity === "favorite") {
            const arr = favoriteContactList.length === 0 ? contactList : regularContactList;

            const picked = arr.find((item: any) => {
                return item.contact.id === id && item.number === number;
            });
            const regList = arr.filter((item: any) => {
                return item !== picked;
            });

            if (picked !== undefined) {
                setFavoriteContactList(favoriteContactList.concat(picked));
                setRegularContactList(regList);
            }
        } else {
            const arr = favoriteContactList;

            const picked = arr.find((item: any) => {
                return item.contact.id === id && item.number === number;
            });
            const favList = arr.filter((item: any) => {
                return item !== picked;
            });

            if (picked !== undefined) {
                setRegularContactList(regularContactList.concat(picked));
                setFavoriteContactList(favList);
            }
        }
    };

    const handleDeleteContact = (id: number) => {
        deleteContact({
            variables: {
                id: id,
            },
        }).then(() => {
            dataList.refetch();
        });
        setIsLoading(true);
    };

    const handleShowModal = () => {
        showModal === "none" ? setShowModal("block") : setShowModal("none");
        setAddContactNumber([]);
        setAddContact({ first_name: "", last_name: "" });
    };

    const handleContactNumberAdd = () => {
        const add = { number: "" };
        setAddContactNumber(addContactNumber.concat(add));
    };

    const handleChangeAddNumber = (key: number, num: string) => {
        addContactNumber[key].number = num;
    };

    const submitNewContact = () => {
        const body = {
            first_name: addContact.first_name,
            last_name: addContact.last_name,
            phones: addContactNumber,
        };

        submitContact({
            variables: body,
        }).then(() => {
            if (!error) {
                dataList.refetch();
                handleShowModal();
            } else {
                alert("there is an error when submit new contact");
            }
        });

        setIsLoading(true);
    };

    return isLoading === true ? (
        <LoadScreen />
    ) : (
        <React.Fragment>
            <div css={{ paddingBottom: "80px" }}>
                <div css={{ ...style.layout }}>
                    <div css={style.headerCard}>
                        <h3 css={style.headerText}>Contact</h3>
                    </div>
                </div>
                <div css={style.layout}>
                    <input
                        css={style.searchContainer}
                        placeholder="Search your contact here"
                        onChange={(e) => {
                            setTimeout(() => {
                                setSearchContact(e.target.value);
                            }, 1000);
                        }}
                    />
                </div>
                {searchContactList.length > 0 ? (
                    <div
                        css={{
                            ...style.layout,
                            paddingLeft: "25px",
                            paddingRight: "25px",
                            marginBottom: "10px",
                        }}
                    >
                        <table>
                            <tr css={style.tableTitle}>
                                <th
                                    css={{
                                        fontSize: "18px",
                                        fontWeight: "700",
                                        width: "100px",
                                    }}
                                >
                                    Name
                                </th>
                                <th
                                    css={{
                                        fontSize: "18px",
                                        fontWeight: "700",
                                        width: "200px",
                                        overflow: "hidden",
                                    }}
                                >
                                    Number
                                </th>
                            </tr>
                            {searchContactList.map((item: any, i: any) => {
                                return (
                                    <tr key={i}>
                                        <td css={{ textAlign: "center" }}>
                                            {item.first_name + " " + item.last_name}
                                        </td>
                                        <td css={{ textAlign: "left" }}>
                                            {item.phones?.map((item: any, i: any) => {
                                                return <ul key={i}>{item.number}</ul>;
                                            })}
                                        </td>
                                    </tr>
                                );
                            })}
                        </table>
                    </div>
                ) : (
                    <>
                        {/* favorite contact */}
                        <div
                            css={{
                                ...style.layout,
                                paddingLeft: "25px",
                                paddingRight: "25px",
                                marginBottom: "10px",
                            }}
                        >
                            {favoriteContactList.length > 0 ? (
                                <table>
                                    <tr css={style.tableTitle}>
                                        <th
                                            css={{
                                                fontSize: "18px",
                                                fontWeight: "700",
                                                width: "100px",
                                            }}
                                        >
                                            Name
                                        </th>
                                        <th
                                            css={{
                                                fontSize: "18px",
                                                fontWeight: "700",
                                                width: "200px",
                                                overflow: "hidden",
                                            }}
                                        >
                                            Number
                                        </th>
                                    </tr>
                                    {favoriteContactList.map((item: any, i: any) => {
                                        return (
                                            <tr
                                                key={i}
                                                css={{
                                                    ":hover": {
                                                        backgroundColor: "#ddd",
                                                    },
                                                }}
                                            >
                                                <td css={{ textAlign: "center" }}>
                                                    {item.contact.first_name +
                                                        " " +
                                                        item.contact.last_name}
                                                </td>
                                                <td css={{ textAlign: "left" }}>{item.number}</td>
                                                <td>
                                                    <span
                                                        onClick={(e) =>
                                                            handlePickedContact(
                                                                item.contact.id,
                                                                item.number,
                                                                "regular"
                                                            )
                                                        }
                                                    >
                                                        &#8617;
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </table>
                            ) : (
                                <div css={style.welcomeCardContainer}>
                                    <p>
                                        Hey, Do you have favorite one? You can click stars icon
                                        below! &#9196;
                                    </p>
                                </div>
                            )}
                        </div>
                        {/* favorite contact */}
                        <div css={{ ...style.layout, padding: 0 }}>
                            <table>
                                <tr css={{ backgroundColor: "#f2f2f2" }}>
                                    <th
                                        css={{
                                            fontSize: "15px",
                                            fontWeight: "400",
                                            width: "150px",
                                        }}
                                    >
                                        Name
                                    </th>
                                    <th
                                        css={{
                                            fontSize: "15px",
                                            fontWeight: "400",
                                            width: "150px",
                                        }}
                                    >
                                        Number
                                    </th>
                                </tr>
                                {regularContactList.length > 0
                                    ? regularContactList.map((item: any, i: any) => {
                                          return (
                                              <tr
                                                  key={i}
                                                  css={{
                                                      ":hover": {
                                                          backgroundColor: "#ddd",
                                                      },
                                                  }}
                                              >
                                                  <td css={{ textAlign: "center" }}>
                                                      {item.contact.first_name +
                                                          " " +
                                                          item.contact.last_name}
                                                  </td>
                                                  <td css={{ textAlign: "left" }}>{item.number}</td>
                                                  <td>
                                                      <span
                                                          onClick={(e) =>
                                                              handlePickedContact(
                                                                  item.contact.id,
                                                                  item.number,
                                                                  "favorite"
                                                              )
                                                          }
                                                      >
                                                          &#11088;
                                                      </span>
                                                      <span
                                                          onClick={(e) => {
                                                              handleDeleteContact(item.contact.id);
                                                          }}
                                                      >
                                                          &#x274E;
                                                      </span>
                                                  </td>
                                              </tr>
                                          );
                                      })
                                    : contactList.map((item: any, i: any) => {
                                          return (
                                              <tr
                                                  key={i}
                                                  css={{
                                                      ":hover": {
                                                          backgroundColor: "#ddd",
                                                      },
                                                  }}
                                              >
                                                  <td css={{ textAlign: "center" }}>
                                                      {item.contact.first_name +
                                                          " " +
                                                          item.contact.last_name}
                                                  </td>
                                                  <td css={{ textAlign: "left" }}>{item.number}</td>
                                                  <td>
                                                      <span
                                                          onClick={(e) =>
                                                              handlePickedContact(
                                                                  item.contact.id,
                                                                  item.number,
                                                                  "favorite"
                                                              )
                                                          }
                                                      >
                                                          &#11088;
                                                      </span>
                                                      <span
                                                          onClick={(e) => {
                                                              handleDeleteContact(item.contact.id);
                                                          }}
                                                      >
                                                          &#x274E;
                                                      </span>
                                                  </td>
                                              </tr>
                                          );
                                      })}
                            </table>
                        </div>
                    </>
                )}
                <div css={{ ...style.layout }}>
                    <div css={{ display: "inline-block" }}>
                        {pageList.map((item: any, i: any) => {
                            return (
                                <a
                                    style={{
                                        backgroundColor: pages === item ? "#4CAF50" : "#fff",
                                        color: pages === item ? "white" : "black",
                                    }}
                                    css={style.pageContainer}
                                    onClick={(e) => setPages(item)}
                                    href="#"
                                    key={i}
                                >
                                    {item}
                                </a>
                            );
                        })}
                    </div>
                </div>

                <ModalContainer display={showModal}>
                    <>
                        <span onClick={() => handleShowModal()} css={style.exitBtnIcon}>
                            &times;
                        </span>
                        <div>
                            <div css={style.modalField}>
                                <label css={style.modalLabel}>First Name</label>
                                <input
                                    value={addContact.first_name}
                                    onChange={(e) =>
                                        setAddContact({ ...addContact, first_name: e.target.value })
                                    }
                                />
                            </div>
                            <div css={style.modalField}>
                                <label css={style.modalLabel}>Last Name</label>
                                <input
                                    value={addContact.last_name}
                                    onChange={(e) =>
                                        setAddContact({ ...addContact, last_name: e.target.value })
                                    }
                                />
                            </div>
                            <span onClick={() => handleContactNumberAdd()}>
                                + Add another number
                            </span>
                            {addContactNumber.map((item: any, i: number) => {
                                return (
                                    <div css={style.modalField} key={i}>
                                        <label css={style.modalLabel}>
                                            {"Number" + " " + `${i + 1}`}
                                        </label>
                                        <input
                                            type="number"
                                            onChange={(e) =>
                                                handleChangeAddNumber(i, e.target.value)
                                            }
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <div css={style.submitBtnContainer}>
                            <button onClick={() => submitNewContact()}>Submit</button>
                        </div>
                    </>
                </ModalContainer>
                <AddButton e={() => handleShowModal()} />
            </div>
        </React.Fragment>
    );
};

export default Main;

const style = {
    layout: css({
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "25px",
    }),
    headerCard: css({
        backgroundColor: "lightblue",
        height: "50px",
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
        maxWidth: "500px",
        display: "flex",
        borderRadius: "5px",
    }),
    headerText: css({
        width: "100%",
        textAlign: "center",
    }),
    searchContainer: css({
        width: "300px",
        height: "25px",
        borderRadius: "10px",
        paddingInline: "8px",
    }),
    welcomeCardContainer: css({
        backgroundColor: "lightgray",
        width: "200px",
        height: "100px",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        textAlign: "center",
    }),
    tableTitle: css({
        textAlign: "center",
        backgroundColor: "#04AA6D",
        color: "white",
        height: "25px",
    }),
    tableFontTitle: css({
        width: "300px",
    }),
    modalField: css({
        marginBottom: "10px",
        fontSize: "15px",
    }),
    modalLabel: css({
        marginRight: "10px",
        minWidth: "100px",
    }),
    submitBtnContainer: css({
        display: "flex",
        height: "30px",
        marginTop: "20px",
        justifyContent: "flex-end",
    }),
    pageContainer: css({
        textDecoration: "none",
        float: "left",
        padding: "8px 16px",
        ":hover": {
            backgroundColor: "#ddd",
        },
    }),
    exitBtnIcon: css({
        color: "#aaaaaa",
        float: "right",
        fontSize: "28px",
        fontWeight: "bold",
    }),
};
