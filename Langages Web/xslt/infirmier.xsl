<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : infirmier.xsl
    Created on : 19 octobre 2016, 10:14
    Author     : aminca
    Description:
        Purpose of transformation follows.
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
                xmlns:exsl="http://exslt.org/common"
                xmlns:cab="http://uga-grenoble.fr/ville/cabinet"
                xmlns:act="http://www.ujf-grenoble.fr/l3miage/actes">
    
    <xsl:output method="html"/>
    
    <xsl:param name="destinedId" select="001"/> 
    <xsl:variable name="actes" select="document('actes.xml', /)/act:ngap"/>
    
    <xsl:template match="/">
        <xsl:variable name="infirmier" select="//cab:infirmier[@id=$destinedId]"/>
            <html>
            <link rel="stylesheet" href="newcss.css"/>
                <head>
                    <title>infirmier</title>
                    <script type="text/javascript">
                        function openFacture(prenom, nom, actes) {
                            var width  = 500;
                            var height = 300;
                            if(window.innerWidth) {
                                var left = (window.innerWidth-width)/2;
                                var top = (window.innerHeight-height)/2;
                            }
                            else {
                                var left = (document.body.clientWidth-width)/2;
                                var top = (document.body.clientHeight-height)/2;
                            }
                            var factureWindow = window.open('','facture','menubar=yes, scrollbars=yes, top='+top+', left='+left+', width='+width+', height='+height+'');
                            factureText = "Facture pour : " + prenom + " " + nom;
                            factureWindow.document.write(factureText);
                        }        
                    </script>
                </head>
                <body>
                    <p>
                        <h1>Bonjour <xsl:value-of select="$infirmier/cab:prénom"/></h1><br/>
                        Aujourd'hui, vous avez <xsl:apply-templates select="//cab:patients"/> patient(s).<br/>
                        <br/><br/>
                        <strong>Liste des patients : </strong>
                        <br/><br/>
                        <table border="1px solid">
                            <xsl:apply-templates select="//cab:patient/cab:visite[@intervenant=$destinedId]/.."/>
                        </table>
                    </p>
                </body>
            </html>
    </xsl:template>
    
    <xsl:template match="cab:patients">
            <xsl:variable name="patient" select="//cab:visite[@intervenant=$destinedId]"/>
            <xsl:value-of select="count($patient)"/>
    </xsl:template>
    
    <xsl:template match="cab:patient">
        <th>Nom</th> <th>Prénom</th><th>Adresse </th><th>Soins</th><th>Facture</th>
        <tr> 
            <td>
                <xsl:value-of select="cab:nom"/>
            </td>
            <td>
                <xsl:value-of select="cab:prénom"/>
            </td>
            <td>
                <xsl:value-of select="cab:adresse/cab:étage"/> &#160;
            
                <xsl:value-of select="cab:adresse/cab:numéro"/> &#160;
            
                <xsl:value-of select="cab:adresse/cab:rue"/> &#160;
            
                <xsl:value-of select="cab:adresse/cab:ville"/> &#160;
            
                <xsl:value-of select="cab:adresse/cab:codePostal"/>
            </td>
            <td>
                <ul>
                    <xsl:apply-templates select="cab:visite[@intervenant=$destinedId]/cab:acte"/>
                </ul>
            </td>
            <td>
                <button type="button" name="facture">
                    <xsl:attribute name="onclick">
                        openFacture('<xsl:value-of select="cab:prénom"/>', 
                                    '<xsl:value-of select="cab:nom"/>', 
                                    '<xsl:value-of select="variable_listeact"/>')
                    </xsl:attribute>      
                    Facture
                </button>
            </td>
        </tr>
    </xsl:template>
    <xsl:template match="cab:visite[@intervenant=$destinedId]/cab:acte">
        <xsl:variable name="idact" select="@id"/> 
        <li>
            <xsl:value-of select="$actes/act:actes/act:acte[@id=$idact]"/>
        </li>
    </xsl:template>
</xsl:stylesheet>