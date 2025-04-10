package com.paf.learnhub.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class TestUser {
    @Id
    private String id;
    private String name;
    private String email;
    private String address;

    public TestUser() {}
    public TestUser(String name, String email,String address) {
        this.name = name;
        this.email = email;
        this.address=address;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getaddress() { return address; }
    public void setaddress(String address) { this.address = address; }
}
